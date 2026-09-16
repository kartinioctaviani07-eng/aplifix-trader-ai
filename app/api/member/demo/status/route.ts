import { NextResponse } from "next/server";

import { sql } from "@/lib/db/postgres";

import { getMemberSession } from "@/lib/member/session";

import { demoMonitor } from "@/lib/member/demoMonitor";

interface MemberAccountRow {
  id: string;
  role: string;
  status: string;
}

interface DemoAccountRow {
  id: string;
  initial_balance: number;
  balance: number;
  created_at: number;
  updated_at: number;
}

interface PositionRow {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  status: "OPEN";
  opened_at: number;
  updated_at: number;
}

interface TradeRow {
  id: string;
  position_id: string | null;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  realized_pnl: number;
  created_at: number;
  trade_type: "OPEN" | "CLOSE";
}

interface AIActivityRow {
  id: string;
  symbol: string;
  action: "BUY" | "SELL" | "HOLD" | "WAIT";
  confidence: number;
  total_score: number;
  price: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  trend: string | null;
  reasons: string;
  execution_status:
    | "EXECUTED"
    | "NOT_EXECUTED"
    | "REJECTED";
  execution_reason: string;
  decision_id: string;
  created_at: number;
}

function parseReasons(
  value: unknown,
): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string =>
        typeof item === "string",
    );
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed: unknown =
      JSON.parse(value);

    if (
      Array.isArray(parsed) &&
      parsed.every(
        (item): item is string =>
          typeof item === "string",
      )
    ) {
      return parsed;
    }

    return [];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const session =
      await getMemberSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const memberRows =
      await sql`
        SELECT
          id,
          role,
          status
        FROM member_accounts
        WHERE id = ${session.memberId}
        LIMIT 1
      `;

    const member =
      memberRows[0] as
        | MemberAccountRow
        | undefined;

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Member tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    if (
      member.role !== "MEMBER" ||
      member.status !== "ACTIVE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Akun Member belum aktif.",
        },
        { status: 403 },
      );
    }

    const monitored =
      await demoMonitor.monitorMember(
        member.id,
      );

    const accountRows =
      await sql`
        SELECT
          id,
          initial_balance,
          balance,
          created_at,
          updated_at
        FROM demo_accounts
        WHERE member_id = ${member.id}
        LIMIT 1
      `;

    const rawAccount =
      accountRows[0] as
        | DemoAccountRow
        | undefined;

    if (!rawAccount) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Demo Account belum tersedia.",
        },
        { status: 404 },
      );
    }

    const account: DemoAccountRow = {
      id: rawAccount.id,
      initial_balance: Number(
        rawAccount.initial_balance,
      ),
      balance: Number(
        rawAccount.balance,
      ),
      created_at: Number(
        rawAccount.created_at,
      ),
      updated_at: Number(
        rawAccount.updated_at,
      ),
    };

    const positionRows =
      await sql`
        SELECT
          id,
          symbol,
          side,
          quantity,
          entry_price,
          current_price,
          unrealized_pnl,
          status,
          opened_at,
          updated_at
        FROM member_demo_positions
        WHERE member_id = ${member.id}
          AND status = 'OPEN'
        ORDER BY opened_at DESC
      `;

    const positions: PositionRow[] =
      positionRows.map(
        (row) => {
          const position =
            row as unknown as PositionRow;

          return {
            id: position.id,
            symbol: position.symbol,
            side: position.side,
            quantity: Number(
              position.quantity,
            ),
            entry_price: Number(
              position.entry_price,
            ),
            current_price: Number(
              position.current_price,
            ),
            unrealized_pnl: Number(
              position.unrealized_pnl,
            ),
            status: "OPEN",
            opened_at: Number(
              position.opened_at,
            ),
            updated_at: Number(
              position.updated_at,
            ),
          };
        },
      );

    const tradeRows =
      await sql`
        SELECT
          t.id,
          t.position_id,
          t.symbol,
          t.side,
          t.quantity,
          t.price,
          t.realized_pnl,
          t.created_at,
          CASE
            WHEN t.position_id IS NULL
              THEN 'OPEN'
            WHEN t.created_at = (
              SELECT MIN(t2.created_at)
              FROM member_demo_trades t2
              WHERE t2.position_id = t.position_id
            )
              THEN 'OPEN'
            ELSE 'CLOSE'
          END AS trade_type
        FROM member_demo_trades t
        WHERE t.member_id = ${member.id}
        ORDER BY t.created_at DESC
        LIMIT 50
      `;

    const trades: TradeRow[] =
      tradeRows.map(
        (row) => {
          const trade =
            row as unknown as TradeRow;

          return {
            id: trade.id,
            position_id:
              trade.position_id,
            symbol: trade.symbol,
            side: trade.side,
            quantity: Number(
              trade.quantity,
            ),
            price: Number(
              trade.price,
            ),
            realized_pnl: Number(
              trade.realized_pnl,
            ),
            created_at: Number(
              trade.created_at,
            ),
            trade_type:
              trade.trade_type,
          };
        },
      );

    /*
     * AI Activity Log
     *
     * Member hanya boleh melihat activity
     * milik dirinya sendiri.
     *
     * Tidak ada AI internal member lain yang
     * ikut dikirim ke browser.
     */

    const activityRows =
      await sql`
        SELECT
          id,
          symbol,
          action,
          confidence,
          total_score,
          price,
          risk_level,
          trend,
          reasons,
          execution_status,
          execution_reason,
          decision_id,
          created_at
        FROM ai_activity_logs
        WHERE member_id = ${member.id}
        ORDER BY created_at DESC
        LIMIT 50
      `;

    const aiActivity: AIActivityRow[] =
      activityRows.map(
        (row) => {
          const activity =
            row as unknown as AIActivityRow;

          return {
            id: activity.id,
            symbol:
              activity.symbol,
            action:
              activity.action,
            confidence: Number(
              activity.confidence,
            ),
            total_score: Number(
              activity.total_score,
            ),
            price: Number(
              activity.price,
            ),
            risk_level:
              activity.risk_level,
            trend:
              activity.trend,
            reasons:
              activity.reasons,
            execution_status:
              activity.execution_status,
            execution_reason:
              activity.execution_reason,
            decision_id:
              activity.decision_id,
            created_at: Number(
              activity.created_at,
            ),
          };
        },
      );

    const unrealizedPnl =
      positions.reduce(
        (total, position) =>
          total +
          position.unrealized_pnl,
        0,
      );

    const realizedPnl =
      trades.reduce(
        (total, trade) =>
          total +
          trade.realized_pnl,
        0,
      );

    const positionMarketValue =
      positions.reduce(
        (total, position) =>
          total +
          position.quantity *
            position.current_price,
        0,
      );

    const equity =
      account.balance +
      positionMarketValue;

    const totalPnl =
      equity -
      account.initial_balance;

    return NextResponse.json({
      success: true,
      data: {
        account: {
          id: account.id,
          initialBalance:
            account.initial_balance,
          balance:
            account.balance,
          equity,
          realizedPnl,
          unrealizedPnl,
          totalPnl,
          createdAt:
            account.created_at,
          updatedAt:
            account.updated_at,
        },

        positions:
          positions.map(
            (position) => ({
              id: position.id,
              symbol:
                position.symbol,
              side:
                position.side,
              quantity:
                position.quantity,
              entryPrice:
                position.entry_price,
              currentPrice:
                position.current_price,
              unrealizedPnl:
                position.unrealized_pnl,
              status:
                position.status,
              openedAt:
                position.opened_at,
              updatedAt:
                position.updated_at,
            }),
          ),

        trades:
          trades.map(
            (trade) => ({
              id: trade.id,
              positionId:
                trade.position_id,
              symbol:
                trade.symbol,
              side:
                trade.side,
              quantity:
                trade.quantity,
              price:
                trade.price,
              realizedPnl:
                trade.realized_pnl,
              type:
                trade.trade_type,
              createdAt:
                trade.created_at,
            }),
          ),

        /*
         * Activity AI yang aman untuk Member.
         */

        aiActivity:
          aiActivity.map(
            (activity) => ({
              id:
                activity.id,
              symbol:
                activity.symbol,
              action:
                activity.action,
              confidence:
                activity.confidence,
              totalScore:
                activity.total_score,
              price:
                activity.price,
              riskLevel:
                activity.risk_level,
              trend:
                activity.trend ??
                "UNKNOWN",
              reasons:
                parseReasons(
                  activity.reasons,
                ),
              executionStatus:
                activity.execution_status,
              executionReason:
                activity.execution_reason,
              decisionId:
                activity.decision_id,
              createdAt:
                activity.created_at,
            }),
          ),

        monitored: {
          updated:
            monitored.updated,
          closed:
            monitored.closed,
        },

        timestamp:
          Date.now(),
      },
    });
  } catch (error) {
    console.error(
      "Member Demo Status API Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal mengambil status Demo Account.",
      },
      { status: 500 },
    );
  }
}
