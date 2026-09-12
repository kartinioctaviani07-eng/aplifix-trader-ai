import {
  candleHub,
} from "@/lib/core/market/CandleHub";

import "@/lib/core/market/candleIndex";

import {
  aiBrain,
} from "./aiBrain";

import {
  executeTrade,
} from "./tradeExecutor";

import {
  positionManager,
} from "./PositionManager";

import {
  monitorPositions,
} from "./positionMonitor";

import {
  ceoAccount,
} from "./ceoAccount";

export type CEOAction =
  | "BUY"
  | "SELL"
  | "HOLD"
  | "WAIT";

export type CEOResult = {
  symbol: string;
  action: CEOAction;
  confidence: number;
  price: number;
  riskLevel: string;
  position: ReturnType<
    typeof positionManager.getPosition
  >;
  executed: boolean;
  message: string;
  account: ReturnType<
    typeof ceoAccount.getSnapshot
  >;
  timestamp: number;
};

export async function runCEO(
  symbol: string
): Promise<CEOResult> {

  const candles =
    await candleHub.getCandles(
      symbol,
      "1h"
    );

  const lastCandle =
    candles.at(-1);

  if (!lastCandle) {
    throw new Error(
      `Tidak ada candle untuk ${symbol}`
    );
  }

  const price =
    lastCandle.close;

  const monitor =
    monitorPositions(
      symbol,
      price
    );

  const brain =
    await aiBrain.think(
      symbol,
      candles
    );

  const action =
    brain.decision.action;

  const confidence =
    brain.decision.confidence;

  const existing =
    positionManager.getPosition(
      symbol
    );

  if (
    existing
  ) {

    return {
      symbol,

      action,

      confidence,

      price,

      riskLevel:
        brain.risk.level,

      position:
        existing,

      executed:
        monitor.closed.length > 0,

      message:
        monitor.closed.length > 0
          ? `Posisi ditutup: ${monitor.closed[0].reason}`
          : "Posisi masih terbuka.",

      account:
        ceoAccount.getSnapshot(),

      timestamp:
        Date.now(),
    };
  }

  if (
    action === "BUY" &&
    confidence >= 75 &&
    brain.risk.level === "LOW"
  ) {

    const position =
      await executeTrade(
        symbol,
        "BUY"
      );

    if (position) {

      return {
        symbol,

        action,

        confidence,

        price,

        riskLevel:
          brain.risk.level,

        position,

        executed: true,

        message:
          "CEO membuka posisi BUY.",

        account:
          ceoAccount.getSnapshot(),

        timestamp:
          Date.now(),
      };
    }

    return {
      symbol,

      action,

      confidence,

      price,

      riskLevel:
        brain.risk.level,

      position: null,

      executed: false,

      message:
        "Sinyal BUY ada, tetapi posisi tidak dapat dibuka.",

      account:
        ceoAccount.getSnapshot(),

      timestamp:
        Date.now(),
    };
  }

  return {
    symbol,

    action,

    confidence,

    price,

    riskLevel:
      brain.risk.level,

    position: null,

    executed: false,

    message:
      action === "BUY"
        ? "BUY ditahan karena confidence atau risk belum memenuhi syarat."
        : `CEO memilih ${action}.`,

    account:
      ceoAccount.getSnapshot(),

    timestamp:
      Date.now(),
  };
}
