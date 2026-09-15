"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type DecisionAction =
  | "BUY"
  | "SELL"
  | "HOLD"
  | "WAIT";

type Trend =
  | "Bullish"
  | "Bearish"
  | "Neutral";

type RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

type AISignal = {
  symbol: string;
  technical: {
    ema20: number;
    ema50: number;
    trend: Trend;
    trendStrength: number;
    rsi: number;
    macd: number;
    signal: number;
    atr: number;
    adx: number;
    candlePattern: string;
  };
  marketScore: {
    technicalScore: number;
    reasons: string[];
  };
  multiTimeframe: {
    overallTrend: Trend;
    averageScore: number;
    confidence: number;
  };
  consensus: {
    action: DecisionAction;
    confidence: number;
    bullishVotes: number;
    bearishVotes: number;
    score: number;
    reason: string[];
  };
  sentiment: {
    score: number;
    positive: number;
    negative: number;
    neutral: number;
    dominant: string;
    confidence: number;
    reasons: string[];
  };
  fundamental: {
    score: number;
    reasons: string[];
    marketCap: number | null;
    volume24h: number | null;
    priceChange24h: number | null;
    marketCapRank: number | null;
  };
  macro: {
    score: number;
    reasons: string[];
    inflation: number | null;
    unemployment: number | null;
    gdpGrowth: number | null;
    provider: string;
  };
  risk: {
    riskScore: number;
    level: RiskLevel;
    reasons: string[];
  };
  learning: {
    totalDecision: number;
    lastAction: DecisionAction | null;
    winRate: number;
    totalProfit: number;
    averageConfidence: number;
    confidenceBonus: number;
    profitTrade: number;
    lossTrade: number;
  };
  decision: {
    id: string;
    action: DecisionAction;
    confidence: number;
    totalScore: number;
    reason: string[];
  };
  positions: Array<{
    id: string;
    symbol: string;
    side: "BUY" | "SELL";
    entryPrice: number;
    currentPrice: number;
    quantity: number;
    stopLoss: number;
    takeProfit: number;
    openedAt: number;
    status: "OPEN" | "CLOSED";
    decisionId?: string;
  }>;
  timestamp: number;
};

type AISignalResponse = {
  success: boolean;
  total: number;
  data: AISignal[];
  timestamp: number;
  message?: string;
};

const actionClass: Record<DecisionAction, string> = {
  BUY: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  SELL: "border-red-500/30 bg-red-500/10 text-red-400",
  HOLD: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  WAIT: "border-slate-600 bg-slate-800 text-slate-300",
};

const trendClass: Record<Trend, string> = {
  Bullish: "text-emerald-400",
  Bearish: "text-red-400",
  Neutral: "text-slate-400",
};

function formatNumber(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

function formatCompact(value: number | null): string {
  if (value === null) {
    return "-";
  }

  if (Math.abs(value) >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }

  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }

  return formatNumber(value);
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getConfidenceClass(confidence: number): string {
  if (confidence >= 75) {
    return "text-emerald-400";
  }

  if (confidence >= 60) {
    return "text-amber-400";
  }

  return "text-slate-300";
}

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {label}
        </span>
        <span className="font-medium text-slate-300">
          {value}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{
            width: `${Math.min(
              100,
              Math.max(0, value)
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function SignalCard({
  signal,
}: {
  signal: AISignal;
}) {
  const decision = signal.decision;
  const hasPosition =
    signal.positions.length > 0;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-white">
              {signal.symbol}
            </h2>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${actionClass[decision.action]}`}
            >
              {decision.action}
            </span>

            {hasPosition ? (
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                Position Active
              </span>
            ) : (
              <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-400">
                No Position
              </span>
            )}
          </div>

          <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">
            APLIFIX AI Brain · 1H analysis
          </p>
        </div>

        <div className="lg:text-right">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            CEO Confidence
          </p>

          <p
            className={`mt-1 text-3xl font-bold ${getConfidenceClass(
              decision.confidence
            )}`}
          >
            {decision.confidence}%
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Total score {decision.totalScore}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">
            Technical
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {signal.marketScore.technicalScore}
          </p>

          <p
            className={`mt-1 text-xs font-medium ${trendClass[signal.technical.trend]}`}
          >
            {signal.technical.trend}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">
            Multi-Timeframe
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {signal.multiTimeframe.averageScore}
          </p>

          <p
            className={`mt-1 text-xs font-medium ${trendClass[signal.multiTimeframe.overallTrend]}`}
          >
            {signal.multiTimeframe.overallTrend}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">
            Sentiment
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {signal.sentiment.score}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {signal.sentiment.dominant}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">
            Risk
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {signal.risk.level}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Score {signal.risk.riskScore}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">
              Intelligence Breakdown
            </h3>

            <span className="text-xs text-slate-600">
              AI Brain
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <ScoreBar
              label="Technical"
              value={
                signal.marketScore.technicalScore
              }
            />

            <ScoreBar
              label="Fundamental"
              value={signal.fundamental.score}
            />

            <ScoreBar
              label="Macro"
              value={signal.macro.score}
            />

            <ScoreBar
              label="Sentiment"
              value={signal.sentiment.score}
            />

            <ScoreBar
              label="Consensus"
              value={signal.consensus.score}
            />

            <ScoreBar
              label="Risk"
              value={signal.risk.riskScore}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
          <h3 className="font-semibold text-white">
            Market Structure
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">
                RSI
              </p>
              <p className="mt-1 font-semibold text-white">
                {signal.technical.rsi}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                ADX
              </p>
              <p className="mt-1 font-semibold text-white">
                {signal.technical.adx}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                ATR
              </p>
              <p className="mt-1 font-semibold text-white">
                {signal.technical.atr}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                EMA 20
              </p>
              <p className="mt-1 font-semibold text-white">
                {formatNumber(
                  signal.technical.ema20
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                EMA 50
              </p>
              <p className="mt-1 font-semibold text-white">
                {formatNumber(
                  signal.technical.ema50
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Pattern
              </p>
              <p className="mt-1 font-semibold text-white">
                {signal.technical.candlePattern}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-500">
              Timeframe Consensus
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                {signal.consensus.bullishVotes} Bullish
              </span>

              <span className="rounded-lg bg-red-500/10 px-3 py-1 text-xs text-red-400">
                {signal.consensus.bearishVotes} Bearish
              </span>

              <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-400">
                {signal.consensus.action}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              CEO Decision
            </p>

            <p className="mt-2 text-xl font-bold text-white">
              {decision.action === "WAIT"
                ? "WAIT FOR BETTER ENTRY"
                : decision.action === "HOLD"
                  ? "HOLD CURRENT MARKET VIEW"
                  : `${decision.action} SIGNAL`}
            </p>

            <div className="mt-4 space-y-2">
              {decision.reason.map(
                (reason) => (
                  <p
                    key={reason}
                    className="text-sm text-slate-300"
                  >
                    ✓ {reason}
                  </p>
                )
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-5 py-4 md:min-w-44">
            <p className="text-xs text-slate-500">
              Execution
            </p>

            <p className="mt-1 font-semibold text-white">
              {hasPosition
                ? "POSITION ACTIVE"
                : decision.action === "BUY" &&
                    decision.confidence >= 75 &&
                    signal.risk.level === "LOW"
                  ? "ELIGIBLE"
                  : "NOT EXECUTED"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-500">
            Fundamental
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {signal.fundamental.score}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Market rank #
            {signal.fundamental.marketCapRank ?? "-"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-500">
            Macro
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {signal.macro.score}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Provider {signal.macro.provider}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-500">
            AI Learning
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {formatNumber(
              signal.learning.totalDecision
            )}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Historical decisions
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
        <span className="text-xs text-slate-600">
          Analysis ID {signal.decision.id.slice(0, 8)}
        </span>

        <span className="text-xs text-slate-500">
          Updated {formatTime(signal.timestamp)}
        </span>
      </div>
    </article>
  );
}

export default function AISignalsPage() {
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const [lastUpdated, setLastUpdated] =
    useState<number | null>(null);

  const loadSignals = useCallback(
    async () => {
      try {
        setError(null);

        const response = await fetch(
          "/api/ai-signals",
          {
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as AISignalResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ??
              "Failed to load AI signals"
          );
        }

        setSignals(result.data);
        setLastUpdated(Date.now());
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Failed to load AI signals";

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadSignals();

    const interval =
      window.setInterval(() => {
        void loadSignals();
      }, 30_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadSignals]);

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <Link
        href="/trader"
        className="mb-6 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">
            APLIFIX Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            AI Signals
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Multi-department AI analysis combining
            technical, multi-timeframe, sentiment,
            fundamental, macro, risk, and learning
            intelligence.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
          <p className="text-xs text-slate-500">
            AI Brain Status
          </p>

          <p className="mt-1 font-semibold text-emerald-400">
            ● Operational
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Auto refresh every 30 seconds
          </p>
        </div>
      </div>

      {loading && signals.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <p className="text-slate-400">
            APLIFIX AI is analyzing the market...
          </p>
        </div>
      ) : null}

      {error && signals.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="font-semibold text-red-400">
            AI analysis unavailable
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void loadSignals()}
            className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            Retry
          </button>
        </div>
      ) : null}

      {signals.length > 0 ? (
        <>
          <div className="mt-8 grid gap-6">
            {signals.map((signal) => (
              <SignalCard
                key={signal.symbol}
                signal={signal}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-500 sm:flex-row">
            <span>
              {signals.length} markets analyzed by
              APLIFIX AI Brain
            </span>

            <span>
              Last refresh:{" "}
              {lastUpdated
                ? formatTime(lastUpdated)
                : "-"}
            </span>
          </div>
        </>
      ) : null}
    </main>
  );
}
