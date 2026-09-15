import {
  runCEO,
} from "./ceoOrchestrator";

export async function runAutoController(
  symbol: string
) {
  return runCEO(symbol);
}
