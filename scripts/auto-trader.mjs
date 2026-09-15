const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "ADAUSDT",
];

const API_BASE = "http://localhost:3000";
const INTERVAL_MS = 60_000;

let running = false;

async function runCycle() {
  if (running) {
    console.log("[AUTO] Cycle sebelumnya masih berjalan.");
    return;
  }

  running = true;

  console.log("");
  console.log("========================================");
  console.log("[AUTO] CEO APLIFIX — CYCLE START");
  console.log(new Date().toLocaleString("id-ID"));
  console.log("========================================");

  try {
    for (const symbol of SYMBOLS) {
      try {
        const response = await fetch(
          `${API_BASE}/api/auto-trader?symbol=${symbol}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.error(
            `[AUTO] ${symbol} ERROR:`,
            result.message ?? `HTTP ${response.status}`
          );
          continue;
        }

        const data = result.data;

        console.log(
          `[AUTO] ${symbol} | ` +
          `${data.action} | ` +
          `confidence=${data.confidence} | ` +
          `risk=${data.riskLevel} | ` +
          `executed=${data.executed}`
        );

        console.log(
          `[AUTO] ${symbol} → ${data.message}`
        );
      } catch (error) {
        console.error(
          `[AUTO] ${symbol} ERROR:`,
          error instanceof Error
            ? error.message
            : error
        );
      }
    }
  } finally {
    running = false;
  }

  console.log("========================================");
  console.log("[AUTO] CEO APLIFIX — CYCLE END");
  console.log("========================================");
}

async function start() {
  console.log("");
  console.log("########################################");
  console.log("#       APLIFIX CEO AUTO TRADER        #");
  console.log("########################################");
  console.log("");
  console.log(`[AUTO] API: ${API_BASE}`);
  console.log(`[AUTO] Interval: ${INTERVAL_MS / 1000} detik`);
  console.log(`[AUTO] Symbols: ${SYMBOLS.join(", ")}`);
  console.log("[AUTO] Tekan Ctrl+C untuk berhenti.");
  console.log("");

  await runCycle();

  setInterval(() => {
    void runCycle();
  }, INTERVAL_MS);
}

process.on("SIGINT", () => {
  console.log("");
  console.log("[AUTO] Auto Trader dihentikan.");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("");
  console.log("[AUTO] Auto Trader dihentikan.");
  process.exit(0);
});

void start();
