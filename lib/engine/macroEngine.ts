import type {
  MacroMarketData,
} from "@/lib/providers/macro/MacroProvider";

export type MacroAnalysis = {
  score: number;
  reasons: string[];
  inflation: number | null;
  unemployment: number | null;
  gdpGrowth: number | null;
  provider: string;
  fetchedAt: number;
};

function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

export function analyzeMacro(
  data: MacroMarketData,
  providerName: string,
): MacroAnalysis {
  let score = 50;
  const reasons: string[] = [];

  const inflation =
    data.inflation?.value ?? null;

  const unemployment =
    data.unemployment?.value ?? null;

  const gdpGrowth =
    data.gdpGrowth?.value ?? null;

  if (inflation !== null) {
    if (inflation <= 2) {
      score += 8;
      reasons.push(
        "Inflasi berada pada level rendah.",
      );
    } else if (inflation <= 3.5) {
      score += 4;
      reasons.push(
        "Inflasi masih relatif terkendali.",
      );
    } else if (inflation <= 6) {
      score -= 4;
      reasons.push(
        "Inflasi mulai memberikan tekanan.",
      );
    } else {
      score -= 8;
      reasons.push(
        "Inflasi tinggi meningkatkan tekanan makro.",
      );
    }
  }

  if (unemployment !== null) {
    if (unemployment <= 4) {
      score += 8;
      reasons.push(
        "Tingkat pengangguran rendah.",
      );
    } else if (unemployment <= 6) {
      score += 4;
      reasons.push(
        "Pasar tenaga kerja masih cukup sehat.",
      );
    } else if (unemployment <= 8) {
      score -= 4;
      reasons.push(
        "Pengangguran mulai memberikan tekanan.",
      );
    } else {
      score -= 8;
      reasons.push(
        "Pengangguran tinggi menunjukkan pelemahan ekonomi.",
      );
    }
  }

  if (gdpGrowth !== null) {
    if (gdpGrowth >= 4) {
      score += 8;
      reasons.push(
        "Pertumbuhan ekonomi kuat.",
      );
    } else if (gdpGrowth >= 2) {
      score += 4;
      reasons.push(
        "Pertumbuhan ekonomi positif.",
      );
    } else if (gdpGrowth >= 0) {
      score -= 2;
      reasons.push(
        "Pertumbuhan ekonomi melambat.",
      );
    } else {
      score -= 8;
      reasons.push(
        "Ekonomi mengalami kontraksi.",
      );
    }
  }

  return {
    score: Math.round(
      clamp(score, 0, 100),
    ),
    reasons,
    inflation,
    unemployment,
    gdpGrowth,
    provider: providerName,
    fetchedAt: data.fetchedAt,
  };
}
