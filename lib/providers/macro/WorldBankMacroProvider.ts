import type {
  MacroIndicator,
  MacroMarketData,
  MacroProvider,
} from "./MacroProvider";

type WorldBankRecord = {
  date?: string;
  value?: number | null;
};

type WorldBankResponse = [
  {
    page?: number;
    pages?: number;
    per_page?: number;
    total?: number;
  },
  WorldBankRecord[],
];

const WORLD_BANK_BASE =
  "https://api.worldbank.org/v2/country/USA/indicator";

const INDICATORS = {
  inflation: "FP.CPI.TOTL.ZG",
  unemployment: "SL.UEM.TOTL.ZS",
  gdpGrowth: "NY.GDP.MKTP.KD.ZG",
} as const;

async function fetchIndicator(
  indicator: string,
): Promise<MacroIndicator | null> {
  const url =
    `${WORLD_BANK_BASE}/${indicator}` +
    "?format=json&per_page=10";

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `World Bank request failed: ${response.status}`,
    );
  }

  const data =
    (await response.json()) as WorldBankResponse;

  const records = data[1] ?? [];

  for (const record of records) {
    const value = record.value;
    const date = record.date;

    if (
      typeof value === "number" &&
      typeof date === "string"
    ) {
      return {
        indicator,
        value,
        date,
      };
    }
  }

  return null;
}

class WorldBankMacroProvider
  implements MacroProvider
{
  name = "World Bank";

  async getMarketData(): Promise<MacroMarketData> {
    const [
      inflation,
      unemployment,
      gdpGrowth,
    ] = await Promise.all([
      fetchIndicator(INDICATORS.inflation),
      fetchIndicator(INDICATORS.unemployment),
      fetchIndicator(INDICATORS.gdpGrowth),
    ]);

    return {
      inflation,
      unemployment,
      gdpGrowth,
      fetchedAt: Date.now(),
    };
  }
}

export const worldBankMacroProvider =
  new WorldBankMacroProvider();
