import Database from "better-sqlite3";

const API_BASE = "http://localhost:3000";
const DB_PATH = "data/aplifix.db";

async function request(
  path,
  options = {}
) {
  const response = await fetch(
    `${API_BASE}${path}`,
    options
  );

  const text =
    await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `${path} returned non-JSON: ${text}`
    );
  }

  if (
    !response.ok ||
    data.success === false
  ) {
    throw new Error(
      `${path} failed: ${JSON.stringify(data)}`
    );
  }

  return data;
}

function getDecision(
  decisionId
) {
  const db =
    new Database(DB_PATH);

  const row =
    db
      .prepare(
        `
          SELECT
            id,
            symbol,
            action,
            confidence,
            reasons,
            entry_price,
            exit_price,
            profit,
            duration,
            result,
            timestamp
          FROM ai_decisions
          WHERE id = ?
        `
      )
      .get(decisionId);

  db.close();

  return row;
}

function cleanup(
  decisionId
) {
  const db =
    new Database(DB_PATH);

  db.prepare(
    `
      DELETE FROM trades
      WHERE symbol = 'LIFECYCLE_TEST'
    `
  ).run();

  db.prepare(
    `
      DELETE FROM positions
      WHERE symbol = 'LIFECYCLE_TEST'
    `
  ).run();

  db.prepare(
    `
      DELETE FROM ai_decisions
      WHERE id = ?
    `
  ).run(decisionId);

  db.prepare(
    `
      UPDATE account
      SET
        balance = initial_balance,
        updated_at = ?
      WHERE id = 1
    `
  ).run(Date.now());

  db.close();
}

async function main() {
  let decisionId = "";

  try {
    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      "APLiFIX — FULL LIFECYCLE TEST"
    );
    console.log(
      "========================================"
    );

    const beforeAccount =
      await request(
        "/api/ceo-account"
      );

    console.log("");
    console.log(
      "[BEFORE] Balance:",
      beforeAccount.account.balance
    );

    decisionId =
      crypto.randomUUID();

    console.log("");
    console.log(
      "[TEST] Decision ID:",
      decisionId
    );

    const db =
      new Database(DB_PATH);

    db.prepare(
      `
        INSERT INTO ai_decisions (
          id,
          symbol,
          action,
          confidence,
          reasons,
          trend,
          ema20,
          ema50,
          rsi,
          macd,
          atr,
          market_condition,
          entry_price,
          exit_price,
          profit,
          duration,
          result,
          timestamp
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
      `
    ).run(
      decisionId,
      "LIFECYCLE_TEST",
      "BUY",
      90,
      JSON.stringify([
        "Lifecycle test BUY."
      ]),
      "Bullish",
      null,
      null,
      null,
      null,
      null,
      "Test",
      null,
      null,
      null,
      null,
      null,
      Date.now()
    );

    db.close();

    console.log("");
    console.log(
      "[1] AI Decision created..."
    );

    console.log(
      JSON.stringify(
        getDecision(
          decisionId
        ),
        null,
        2
      )
    );

    console.log("");
    console.log(
      "[2] Opening BUY position..."
    );

    const opened =
      await request(
        "/api/trade-execute",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            symbol:
              "LIFECYCLE_TEST",
            action:
              "BUY",
            decisionId,
          }),
        }
      );

    console.log(
      JSON.stringify(
        opened,
        null,
        2
      )
    );

    if (!opened.position) {
      throw new Error(
        "Position gagal dibuka."
      );
    }

    console.log("");
    console.log(
      "[3] Checking AI Decision = OPEN..."
    );

    const openedDecision =
      getDecision(
        decisionId
      );

    console.log(
      JSON.stringify(
        openedDecision,
        null,
        2
      )
    );

    if (
      openedDecision?.result !==
      "OPEN"
    ) {
      throw new Error(
        `AI Decision belum OPEN. Result saat ini: ${openedDecision?.result ?? "NULL"}`
      );
    }

    console.log(
      "PASS: AI Decision = OPEN"
    );

    const takeProfit =
      opened.position.takeProfit;

    console.log("");
    console.log(
      "[4] Triggering TAKE PROFIT..."
    );

    const monitored =
      await request(
        "/api/monitor-position",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            symbol:
              "LIFECYCLE_TEST",
            price:
              takeProfit,
          }),
        }
      );

    console.log(
      JSON.stringify(
        monitored,
        null,
        2
      )
    );

    console.log("");
    console.log(
      "[5] Checking AI Decision = PROFIT..."
    );

    const profitDecision =
      getDecision(
        decisionId
      );

    console.log(
      JSON.stringify(
        profitDecision,
        null,
        2
      )
    );

    if (
      profitDecision?.result !==
      "PROFIT"
    ) {
      throw new Error(
        `AI Decision belum PROFIT. Result saat ini: ${profitDecision?.result ?? "NULL"}`
      );
    }

    console.log(
      "PASS: AI Decision = PROFIT"
    );

    console.log("");
    console.log(
      "[6] Checking trade history..."
    );

    const history =
      await request(
        "/api/trade-history"
      );

    const testTrade =
      history.history.find(
        (trade) =>
          trade.decisionId ===
          decisionId
      );

    console.log(
      JSON.stringify(
        testTrade,
        null,
        2
      )
    );

    if (!testTrade) {
      throw new Error(
        "Trade dengan decisionId test tidak ditemukan."
      );
    }

    console.log(
      "PASS: Trade terhubung ke Decision ID"
    );

    console.log("");
    console.log(
      "[7] Checking account..."
    );

    const afterAccount =
      await request(
        "/api/ceo-account"
      );

    console.log(
      JSON.stringify(
        afterAccount.account,
        null,
        2
      )
    );

    if (
      afterAccount.account.balance <=
      beforeAccount.account.balance
    ) {
      throw new Error(
        "Balance tidak bertambah setelah PROFIT."
      );
    }

    console.log(
      "PASS: Balance bertambah"
    );

    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      "ALL LIFECYCLE CHECKS PASS"
    );
    console.log(
      "========================================"
    );

  } catch (error) {
    console.error("");
    console.error(
      "========================================"
    );
    console.error(
      "LIFECYCLE TEST FAILED"
    );
    console.error(
      "========================================"
    );
    console.error(
      error instanceof Error
        ? error.message
        : error
    );

    process.exitCode = 1;

  } finally {
    if (decisionId) {
      console.log("");
      console.log(
        "[CLEANUP] Removing test data..."
      );

      cleanup(
        decisionId
      );

      console.log(
        "[CLEANUP] Test data removed."
      );
    }
  }
}

void main();
