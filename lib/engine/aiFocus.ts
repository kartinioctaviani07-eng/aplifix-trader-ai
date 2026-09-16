import {
  marketHub,
} from "@/lib/core/market";

import {
  marketIntelligenceEngine,
  MarketOpportunity,
} from "./marketIntelligenceEngine";

type FocusMode =
  | "AUTO"
  | "MANUAL";

export type AIFocusMarket = {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  score: number;
};

class AIFocus {
  private current:
    AIFocusMarket | null = null;

  private updatedAt = 0;

  private mode:
    FocusMode = "AUTO";

  private readonly autoRefreshMs =
    30000;

  async getFocus(): Promise<AIFocusMarket | null> {
    if (
      this.mode === "MANUAL" &&
      this.current
    ) {
      return this.current;
    }

    const now =
      Date.now();

    if (
      this.current &&
      now - this.updatedAt <
        this.autoRefreshMs
    ) {
      return this.current;
    }

    try {
      const intelligence =
        await marketIntelligenceEngine.scan();

      const best:
        MarketOpportunity | undefined =
        intelligence.best;

      if (!best) {
        return this.current;
      }

      const ticker =
        await marketHub.getTicker(
          best.symbol
        );

      this.current = {
        symbol:
          ticker.symbol,

        price:
          ticker.price,

        change24h:
          ticker.changePercent,

        volume:
          ticker.volume,

        score:
          best.score,
      };

      this.updatedAt =
        now;

      return this.current;
    } catch (error) {
      console.error(
        "AI Focus AUTO Error:",
        error
      );

      return this.current;
    }
  }

  async setManualFocus(
    symbol: string
  ): Promise<AIFocusMarket | null> {
    try {
      const ticker =
        await marketHub.getTicker(
          symbol
        );

      this.current = {
        symbol:
          ticker.symbol,

        price:
          ticker.price,

        change24h:
          ticker.changePercent,

        volume:
          ticker.volume,

        score:
          0,
      };

      this.mode =
        "MANUAL";

      this.updatedAt =
        Date.now();

      return this.current;
    } catch (error) {
      console.error(
        "Manual focus error:",
        error
      );

      return null;
    }
  }

  setAuto(): void {
    this.mode =
      "AUTO";

    this.current =
      null;

    this.updatedAt =
      0;
  }

  getMode(): FocusMode {
    return this.mode;
  }

  clear(): void {
    this.current =
      null;

    this.updatedAt =
      0;
  }
}

export const aiFocus =
  new AIFocus();
