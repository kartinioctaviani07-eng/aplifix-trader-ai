import {
  NextRequest,
  NextResponse,
} from "next/server";

import { candleHub } from "@/lib/core/market/CandleHub";
import "@/lib/core/market/candleIndex";

import {
  runCEOBacktest,
} from "@/lib/engine/ceoBacktest";

const DEFAULT_SYMBOL =
  "BTCUSDT";

const DEFAULT_INTERVAL =
  "1h";

const DEFAULT_DAYS = 30;

const DEFAULT_INITIAL_BALANCE =
  10_000_000;

const MAX_DAYS = 41;

const CANDLES_PER_DAY:
  Record<string, number> = {
    "1m": 1440,
    "3m": 480,
    "5m": 288,
    "15m": 96,
    "30m": 48,
    "1h": 24,
    "2h": 12,
    "4h": 6,
    "6h": 4,
    "8h": 3,
    "12h": 2,
    "1d": 1,
  };

const MAX_CANDLES = 1000;

function parsePositiveInteger(
  value: string | null,
  fallback: number
): number {
  if (!value) {
    return fallback;
  }

  const parsed =
    Number.parseInt(
      value,
      10
    );

  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : fallback;
}

function getEvaluationCandles(
  interval: string,
  days: number
): number {
  const candlesPerDay =
    CANDLES_PER_DAY[
      interval
    ];

  if (!candlesPerDay) {
    return 0;
  }

  return Math.ceil(
    candlesPerDay * days
  );
}

export async function GET(
  request: NextRequest
) {
  try {
    const symbol =
      (
        request.nextUrl.searchParams.get(
          "symbol"
        ) ??
        DEFAULT_SYMBOL
      )
        .trim()
        .toUpperCase();

    const interval =
      (
        request.nextUrl.searchParams.get(
          "interval"
        ) ??
        DEFAULT_INTERVAL
      )
        .trim()
        .toLowerCase();

    const days =
      Math.min(
        parsePositiveInteger(
          request.nextUrl.searchParams.get(
            "days"
          ),
          DEFAULT_DAYS
        ),
        MAX_DAYS
      );

    const initialBalance =
      parsePositiveInteger(
        request.nextUrl.searchParams.get(
          "initialBalance"
        ),
        DEFAULT_INITIAL_BALANCE
      );

    const evaluationCandles =
      getEvaluationCandles(
        interval,
        days
      );

    if (
      evaluationCandles <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Interval ${interval} belum didukung untuk backtest.`,
        },
        { status: 400 }
      );
    }

    if (
      evaluationCandles >
      MAX_CANDLES
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Periode ${days} hari membutuhkan ${evaluationCandles} candle, melebihi batas provider ${MAX_CANDLES} candle.`,
        },
        { status: 400 }
      );
    }

    /*
     * Fetch the maximum available single-request history.
     * The extra candles act as indicator warm-up data.
     */
    const candles =
      await candleHub.getCandles(
        symbol,
        interval,
        MAX_CANDLES
      );

    if (
      candles.length < 51
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Data candle historis tidak cukup untuk menjalankan backtest.",
          candleCount:
            candles.length,
        },
        { status: 422 }
      );
    }

    const result =
      runCEOBacktest(
        candles,
        initialBalance,
        evaluationCandles
      );

    const evaluationStartIndex =
      Math.max(
        0,
        candles.length -
          evaluationCandles
      );

    return NextResponse.json({
      success: true,
      backtest: {
        symbol,
        interval,
        requestedDays: days,
        candleCount:
          candles.length,
        evaluationCandles,
        warmupCandles:
          evaluationStartIndex,
        provider:
          candleHub.getLastProvider(),
        from:
          candles.at(0)?.time ??
          null,
        evaluationFrom:
          candles.at(
            evaluationStartIndex
          )?.time ??
          null,
        to:
          candles.at(-1)?.time ??
          null,
        initialBalance,
      },
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Backtest gagal dijalankan.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
