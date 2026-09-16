import { sql } from "@/lib/db/postgres";

import { demoWorker } from "@/lib/member/demoWorker";

import { demoExecutor } from "@/lib/member/demoExecutor";

import { demoMonitor } from "@/lib/member/demoMonitor";

import { aiActivityLog } from "@/lib/ai/aiActivityLog";

export interface DemoOrchestratorResult {
  success: boolean;
  memberId: string;
  monitored: number;
  closed: number;
  analyzed: number;
  executed: number;
  decisions: DemoOrchestratorDecision[];
  timestamp: number;
}

export interface DemoOrchestratorDecision {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD" | "WAIT";
  confidence: number;
  totalScore: number;
  price: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  trend: string;
  reasons: string[];
  executed: boolean;
  reason: string;
}

interface DemoAccount {
  id: string;
  member_id: string;
  balance: number;
}

const WATCHLIST = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
] as const;

/**
 * Member Demo memakai policy AGGRESSIVE.
 *
 * Tujuannya membuat demo lebih aktif dan menarik secara marketing,
 * tetapi tetap menggunakan keputusan asli dari APLIFIX AI Brain.
 *
 * Tidak ada random BUY/SELL dan tidak ada transaksi palsu.
 */

const DEMO_MIN_CONFIDENCE = 55;

/**
 * Demo tetap membatasi ukuran posisi.
 * Setiap posisi maksimal 5% dari balance saat ini.
 */

const DEMO_MAX_POSITION_PERCENT = 5;

function shuffleWatchlist(): Array<(typeof WATCHLIST)[number]> {
  const shuffled = [...WATCHLIST];

  for (
    let index = shuffled.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1),
    );

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

class DemoOrchestrator {
  private async getDemoAccount(
    memberId: string,
  ): Promise<DemoAccount> {
    const rows = await sql`
      SELECT
        id,
        member_id,
        balance
      FROM demo_accounts
      WHERE member_id = ${memberId}
      LIMIT 1
    `;

    const account =
      rows[0] as
        | DemoAccount
        | undefined;

    if (!account) {
      throw new Error(
        "Demo Account Member tidak ditemukan.",
      );
    }

    return {
      id: account.id,
      member_id: account.member_id,
      balance: Number(account.balance),
    };
  }

  private calculateQuantity(
    balance: number,
    price: number,
  ): number {
    if (
      !Number.isFinite(balance) ||
      !Number.isFinite(price) ||
      balance <= 0 ||
      price <= 0
    ) {
      return 0;
    }

    const positionValue =
      balance *
      (DEMO_MAX_POSITION_PERCENT / 100);

    const quantity =
      positionValue / price;

    return Number(
      quantity.toFixed(8),
    );
  }

  private canExecute(
    confidence: number,
    riskLevel:
      | "LOW"
      | "MEDIUM"
      | "HIGH",
  ): {
    allowed: boolean;
    reason: string;
  } {
    if (
      !Number.isFinite(confidence) ||
      confidence < DEMO_MIN_CONFIDENCE
    ) {
      return {
        allowed: false,
        reason:
          `Confidence ${confidence}% di bawah minimum Demo Aggressive ${DEMO_MIN_CONFIDENCE}%.`,
      };
    }

    if (riskLevel === "HIGH") {
      return {
        allowed: false,
        reason:
          "Risk HIGH tetap ditolak oleh Demo Aggressive.",
      };
    }

    return {
      allowed: true,
      reason:
        riskLevel === "MEDIUM"
          ? "Demo Aggressive mengizinkan risk MEDIUM dengan position size terbatas."
          : "Signal memenuhi policy Demo Aggressive.",
    };
  }

  private async recordActivity(
    memberId: string,
    decision: {
      symbol: string;
      action:
        | "BUY"
        | "SELL"
        | "HOLD"
        | "WAIT";
      confidence: number;
      totalScore: number;
      price: number;
      riskLevel:
        | "LOW"
        | "MEDIUM"
        | "HIGH";
      trend: string;
      reasons: string[];
      decisionId: string;
    },
    executionStatus:
      | "EXECUTED"
      | "NOT_EXECUTED"
      | "REJECTED",
    executionReason: string,
  ): Promise<void> {
    await aiActivityLog.record({
      memberId,
      symbol: decision.symbol,
      action: decision.action,
      confidence: decision.confidence,
      totalScore: decision.totalScore,
      price: decision.price,
      riskLevel: decision.riskLevel,
      trend: decision.trend,
      reasons: decision.reasons,
      executionStatus,
      executionReason,
      decisionId: decision.decisionId,
    });
  }

  async run(
    memberId: string,
  ): Promise<DemoOrchestratorResult> {
    const normalizedMemberId =
      memberId.trim();

    if (!normalizedMemberId) {
      throw new Error(
        "Member ID wajib diisi.",
      );
    }

    const monitorResult =
      await demoMonitor.monitorMember(
        normalizedMemberId,
      );

    const decisions: DemoOrchestratorDecision[] =
      [];

    let executedCount = 0;

    const cycleWatchlist =
      shuffleWatchlist();

    for (const symbol of cycleWatchlist) {
      const account =
        await this.getDemoAccount(
          normalizedMemberId,
        );

      const decision =
        await demoWorker.analyze(
          normalizedMemberId,
          symbol,
        );

      /*
       * Jika posisi dengan symbol yang sama masih OPEN,
       * AI tidak membuka posisi kedua.
       *
       * Sebaliknya, AI mencatat HOLD agar Member dapat
       * melihat bahwa posisi sedang dipantau.
       */

      const openPosition =
        monitorResult.positions.find(
          (position) =>
            position.symbol === symbol &&
            position.status === "OPEN",
        );

      if (openPosition) {
        const pnl =
          openPosition.unrealizedPnl;

        const pnlText =
          pnl >= 0
            ? `profit Rp${Math.round(pnl).toLocaleString("id-ID")}`
            : `rugi Rp${Math.abs(Math.round(pnl)).toLocaleString("id-ID")}`;

        const holdReason =
          `AI HOLD: posisi ${symbol} masih OPEN dengan ${pnlText}. ` +
          `Entry $${openPosition.entryPrice.toFixed(2)}, ` +
          `harga sekarang $${openPosition.currentPrice.toFixed(2)}. ` +
          `Belum mencapai Stop Loss 2% atau Take Profit 4%, ` +
          `sehingga posisi masih dipantau.`;

        const holdDecision = {
          ...decision,
          action: "HOLD" as const,
          reasons: [
            ...decision.reasons,
            holdReason,
          ],
        };

        await this.recordActivity(
          normalizedMemberId,
          holdDecision,
          "NOT_EXECUTED",
          holdReason,
        );

        decisions.push({
          symbol,
          action: "HOLD",
          confidence:
            decision.confidence,
          totalScore:
            decision.totalScore,
          price:
            openPosition.currentPrice,
          riskLevel:
            decision.riskLevel,
          trend:
            decision.trend,
          reasons:
            holdDecision.reasons,
          executed: false,
          reason: holdReason,
        });

        continue;
      }

      /*
       * HOLD / WAIT juga dicatat.
       *
       * Ini penting karena tidak melakukan transaksi
       * merupakan keputusan AI yang valid.
       */

      if (
        decision.action !== "BUY" &&
        decision.action !== "SELL"
      ) {
        const reason =
          "AI belum memberikan signal BUY/SELL.";

        await this.recordActivity(
          normalizedMemberId,
          decision,
          "NOT_EXECUTED",
          reason,
        );

        decisions.push({
          symbol,
          action: decision.action,
          confidence:
            decision.confidence,
          totalScore:
            decision.totalScore,
          price:
            decision.price,
          riskLevel:
            decision.riskLevel,
          trend:
            decision.trend,
          reasons:
            decision.reasons,
          executed: false,
          reason,
        });

        continue;
      }

      const executionPolicy =
        this.canExecute(
          decision.confidence,
          decision.riskLevel,
        );

      /*
       * Signal BUY/SELL ada,
       * tetapi policy Demo tidak mengizinkan eksekusi.
       */

      if (!executionPolicy.allowed) {
        await this.recordActivity(
          normalizedMemberId,
          decision,
          "REJECTED",
          executionPolicy.reason,
        );

        decisions.push({
          symbol,
          action: decision.action,
          confidence:
            decision.confidence,
          totalScore:
            decision.totalScore,
          price:
            decision.price,
          riskLevel:
            decision.riskLevel,
          trend:
            decision.trend,
          reasons:
            decision.reasons,
          executed: false,
          reason:
            executionPolicy.reason,
        });

        continue;
      }

      const quantity =
        this.calculateQuantity(
          account.balance,
          decision.price,
        );

      if (
        quantity <= 0 ||
        !Number.isFinite(quantity)
      ) {
        const reason =
          "Quantity Demo tidak valid.";

        await this.recordActivity(
          normalizedMemberId,
          decision,
          "NOT_EXECUTED",
          reason,
        );

        decisions.push({
          symbol,
          action: decision.action,
          confidence:
            decision.confidence,
          totalScore:
            decision.totalScore,
          price:
            decision.price,
          riskLevel:
            decision.riskLevel,
          trend:
            decision.trend,
          reasons:
            decision.reasons,
          executed: false,
          reason,
        });

        continue;
      }

      try {
        await demoExecutor.execute({
          memberId:
            normalizedMemberId,
          demoAccountId:
            account.id,
          symbol,
          side:
            decision.action,
          quantity,
          price:
            decision.price,
          decisionId:
            decision.decisionId,
        });

        executedCount += 1;

        const reason =
          `AI membuka posisi Demo Aggressive (${decision.confidence}% confidence, risk ${decision.riskLevel}).`;

        await this.recordActivity(
          normalizedMemberId,
          decision,
          "EXECUTED",
          reason,
        );

        decisions.push({
          symbol,
          action:
            decision.action,
          confidence:
            decision.confidence,
          totalScore:
            decision.totalScore,
          price:
            decision.price,
          riskLevel:
            decision.riskLevel,
          trend:
            decision.trend,
          reasons:
            decision.reasons,
          executed: true,
          reason,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Gagal membuka posisi Demo.";

        await this.recordActivity(
          normalizedMemberId,
          decision,
          "NOT_EXECUTED",
          message,
        );

        decisions.push({
          symbol,
          action:
            decision.action,
          confidence:
            decision.confidence,
          totalScore:
            decision.totalScore,
          price:
            decision.price,
          riskLevel:
            decision.riskLevel,
          trend:
            decision.trend,
          reasons:
            decision.reasons,
          executed: false,
          reason:
            message,
        });
      }
    }

    return {
      success: true,
      memberId:
        normalizedMemberId,
      monitored:
        monitorResult.updated,
      closed:
        monitorResult.closed,
      analyzed:
        WATCHLIST.length,
      executed:
        executedCount,
      decisions,
      timestamp:
        Date.now(),
    };
  }
}

export const demoOrchestrator =
  new DemoOrchestrator();
