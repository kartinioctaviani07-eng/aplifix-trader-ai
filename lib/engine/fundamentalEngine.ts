import type { FundamentalMarketData } from "@/lib/providers/fundamental/CoinGeckoFundamentalProvider";

export type FundamentalAnalysis = {
  score: number;
  reasons: string[];
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  marketCapRank: number | null;
};

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}

function calculateLiquidityRatio(
  marketCap: number,
  volume24h: number
): number {
  if (marketCap <= 0) {
    return 0;
  }

  return volume24h / marketCap;
}

function evaluateLiquidity(
  marketCap: number,
  volume24h: number
): {
  score: number;
  reason: string;
} {
  const liquidityRatio = calculateLiquidityRatio(
    marketCap,
    volume24h
  );

  if (liquidityRatio >= 0.1) {
    return {
      score: 8,
      reason: "Aktivitas perdagangan 24 jam sangat tinggi",
    };
  }

  if (liquidityRatio >= 0.05) {
    return {
      score: 6,
      reason: "Aktivitas perdagangan 24 jam tinggi",
    };
  }

  if (liquidityRatio >= 0.01) {
    return {
      score: 4,
      reason: "Likuiditas pasar tergolong sehat",
    };
  }

  if (liquidityRatio >= 0.005) {
    return {
      score: 2,
      reason: "Likuiditas pasar masih memadai",
    };
  }

  return {
    score: 0,
    reason: "Aktivitas perdagangan relatif rendah",
  };
}

function evaluatePriceChange(
  priceChange24h: number
): {
  score: number;
  reason: string;
} {
  if (priceChange24h >= 5) {
    return {
      score: 8,
      reason: "Harga 24 jam menguat signifikan",
    };
  }

  if (priceChange24h >= 1) {
    return {
      score: 4,
      reason: "Harga 24 jam menunjukkan penguatan",
    };
  }

  if (priceChange24h <= -5) {
    return {
      score: -8,
      reason: "Harga 24 jam mengalami tekanan kuat",
    };
  }

  if (priceChange24h <= -1) {
    return {
      score: -4,
      reason: "Harga 24 jam mengalami tekanan",
    };
  }

  return {
    score: 0,
    reason: "Perubahan harga 24 jam relatif stabil",
  };
}

function evaluateSupply(
  data: FundamentalMarketData
): {
  score: number;
  reason: string | null;
} {
  if (
    data.maxSupply === null ||
    data.totalSupply === null ||
    data.maxSupply <= 0
  ) {
    return {
      score: 0,
      reason: null,
    };
  }

  const supplyRatio =
    data.totalSupply / data.maxSupply;

  if (supplyRatio >= 0.9) {
    return {
      score: 3,
      reason: "Sebagian besar total supply sudah tersedia",
    };
  }

  if (supplyRatio <= 0.5) {
    return {
      score: -3,
      reason: "Sebagian supply masih belum beredar",
    };
  }

  return {
    score: 0,
    reason: "Struktur supply berada pada tingkat moderat",
  };
}

export function analyzeFundamental(
  data: FundamentalMarketData
): FundamentalAnalysis {
  let score = 50;
  const reasons: string[] = [];

  if (data.marketCapRank !== null) {
    if (data.marketCapRank <= 3) {
      score += 12;
      reasons.push(
        "Market cap berada di kelompok teratas"
      );
    } else if (data.marketCapRank <= 10) {
      score += 8;
      reasons.push(
        "Market cap berada di 10 besar"
      );
    } else if (data.marketCapRank <= 25) {
      score += 4;
      reasons.push(
        "Market cap masih berada di 25 besar"
      );
    } else {
      score -= 3;
      reasons.push(
        "Market cap rank relatif rendah"
      );
    }
  }

  const liquidity = evaluateLiquidity(
    data.marketCap,
    data.totalVolume
  );

  score += liquidity.score;
  reasons.push(liquidity.reason);

  const price = evaluatePriceChange(
    data.priceChange24h
  );

  score += price.score;
  reasons.push(price.reason);

  const supply = evaluateSupply(data);

  score += supply.score;

  if (supply.reason !== null) {
    reasons.push(supply.reason);
  }

  score = clampScore(Math.round(score));

  return {
    score,
    reasons,
    marketCap: data.marketCap,
    volume24h: data.totalVolume,
    priceChange24h: data.priceChange24h,
    marketCapRank: data.marketCapRank,
  };
}
