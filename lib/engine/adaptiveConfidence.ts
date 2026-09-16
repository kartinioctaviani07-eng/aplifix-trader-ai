import { aiMemory } from "./aiMemory";

export interface ConfidenceResult {
  baseConfidence: number;
  adjustedConfidence: number;
  bonus: number;
  penalty: number;
}

export function adaptConfidenceFromStats(
  baseConfidence: number,
  wins: number,
  losses: number,
): ConfidenceResult {
  let bonus = 0;
  let penalty = 0;

  if (wins > losses) {
    bonus = Math.min(wins * 0.5, 10);
  }

  if (losses > wins) {
    penalty = Math.min(losses * 0.5, 10);
  }

  const adjustedConfidence = Math.max(
    0,
    Math.min(
      100,
      baseConfidence + bonus - penalty,
    ),
  );

  return {
    baseConfidence,
    adjustedConfidence,
    bonus,
    penalty,
  };
}

export async function adaptConfidence(
  baseConfidence: number,
): Promise<ConfidenceResult> {
  const profitHistory =
    await aiMemory.getProfitHistory();

  const lossHistory =
    await aiMemory.getLossHistory();

  return adaptConfidenceFromStats(
    baseConfidence,
    profitHistory.length,
    lossHistory.length,
  );
}
