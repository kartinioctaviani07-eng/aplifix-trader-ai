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

export async function runAutoController(
  symbol: string
) {

  const candles =
    await candleHub.getCandles(
      symbol,
      "1h"
    );

  const brain =
    await aiBrain.think(
      symbol,
      candles
    );

  const decision =
    brain.decision;

  if (
    decision.action === "BUY"
  ) {

    if (
      decision.confidence < 75
    ) {

      return {
        executed: false,

        message:
          "Confidence belum cukup untuk BUY",

        decision,

        risk:
          brain.risk,
      };
    }

    if (
      brain.risk.level !== "LOW"
    ) {

      return {
        executed: false,

        message:
          "Risk tidak aman",

        risk:
          brain.risk,

        decision,
      };
    }

    const existing =
      positionManager
        .getOpenPositions()
        .filter(
          (position) =>
            position.symbol === symbol
        );

    if (
      existing.length > 0
    ) {

      return {
        executed: false,

        message:
          "Masih ada posisi terbuka",

        positions:
          existing,

        decision,
      };
    }

    const position =
      await executeTrade(
        symbol,
        "BUY"
      );

    if (!position) {

      return {
        executed: false,

        message:
          "Posisi BUY gagal dibuka",

        decision,
      };
    }

    return {
      executed: true,

      action: "BUY" as const,

      position,

      decision,

      risk:
        brain.risk,
    };
  }

  if (
    decision.action === "SELL"
  ) {

    const position =
      positionManager.getPosition(
        symbol
      );

    if (!position) {

      return {
        executed: false,

        message:
          "SELL tidak memiliki posisi terbuka",

        decision,
      };
    }

    return {
      executed: false,

      message:
        "SELL menunggu position monitor",

      position,

      decision,
    };
  }

  return {
    executed: false,

    message:
      "AI belum memberikan sinyal entry",

    decision,

    risk:
      brain.risk,
  };
}
