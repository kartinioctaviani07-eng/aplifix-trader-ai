import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDirectory = path.join(process.cwd(), "data");

fs.mkdirSync(dataDirectory, { recursive: true });

const databasePath = path.join(dataDirectory, "aplifix.db");

const db = new Database(databasePath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS account (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    initial_balance REAL NOT NULL,
    balance REAL NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS positions (
    id TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    entry_price REAL NOT NULL,
    current_price REAL NOT NULL,
    quantity REAL NOT NULL,
    stop_loss REAL NOT NULL,
    take_profit REAL NOT NULL,
    opened_at INTEGER NOT NULL,
    status TEXT NOT NULL,
    decision_id TEXT
  );

  CREATE TABLE IF NOT EXISTS trades (
    id TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    entry_price REAL NOT NULL,
    exit_price REAL NOT NULL,
    quantity REAL NOT NULL,
    profit REAL NOT NULL,
    profit_percent REAL NOT NULL,
    result TEXT NOT NULL,
    opened_at INTEGER NOT NULL,
    closed_at INTEGER NOT NULL,
    decision_id TEXT
  );

  CREATE TABLE IF NOT EXISTS partnership_interests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    interest TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS partnership_status_history (
    id TEXT PRIMARY KEY,
    partnership_id TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (partnership_id)
      REFERENCES partnership_interests(id)
      ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_partnership_status_history_partnership
    ON partnership_status_history(partnership_id);

  CREATE INDEX IF NOT EXISTS idx_partnership_status_history_created
    ON partnership_status_history(created_at);

  CREATE TABLE IF NOT EXISTS ai_decisions (
    id TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    action TEXT NOT NULL,
    confidence REAL NOT NULL,
    reasons TEXT NOT NULL,
    trend TEXT,
    ema20 REAL,
    ema50 REAL,
    rsi REAL,
    macd REAL,
    atr REAL,
    market_condition TEXT,
    entry_price REAL,
    exit_price REAL,
    profit REAL,
    duration INTEGER,
    result TEXT,
    timestamp INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ai_activity_logs (

    id TEXT PRIMARY KEY,

    member_id TEXT NOT NULL,

    symbol TEXT NOT NULL,

    action TEXT NOT NULL,

    confidence REAL NOT NULL,

    total_score REAL NOT NULL,

    price REAL NOT NULL,

    risk_level TEXT NOT NULL,

    trend TEXT,

    reasons TEXT NOT NULL,

    execution_status TEXT NOT NULL,

    execution_reason TEXT NOT NULL,

    decision_id TEXT NOT NULL,

    created_at INTEGER NOT NULL,

    FOREIGN KEY (member_id)

      REFERENCES member_accounts(id)

      ON DELETE CASCADE

  );

  CREATE INDEX IF NOT EXISTS idx_ai_activity_logs_member

    ON ai_activity_logs(member_id);

  CREATE INDEX IF NOT EXISTS idx_ai_activity_logs_symbol

    ON ai_activity_logs(symbol);

  CREATE INDEX IF NOT EXISTS idx_ai_activity_logs_created

    ON ai_activity_logs(created_at);

  CREATE INDEX IF NOT EXISTS idx_ai_activity_logs_action

    ON ai_activity_logs(action);

  CREATE TABLE IF NOT EXISTS member_accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'MEMBER',
    status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_member_accounts_status
    ON member_accounts(status);

  CREATE INDEX IF NOT EXISTS idx_member_accounts_created
    ON member_accounts(created_at);

  CREATE TABLE IF NOT EXISTS member_payments (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    proof_path TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    submitted_at INTEGER,
    reviewed_at INTEGER,
    reviewed_by TEXT,
    rejection_reason TEXT,
    FOREIGN KEY (member_id)
      REFERENCES member_accounts(id)
      ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_member_payments_member
    ON member_payments(member_id);

  CREATE INDEX IF NOT EXISTS idx_member_payments_status
    ON member_payments(status);

  CREATE INDEX IF NOT EXISTS idx_member_payments_submitted
    ON member_payments(submitted_at);

  CREATE TABLE IF NOT EXISTS demo_accounts (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL UNIQUE,
    initial_balance REAL NOT NULL,
    balance REAL NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (member_id)
      REFERENCES member_accounts(id)
      ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_demo_accounts_member
    ON demo_accounts(member_id);

  CREATE TABLE IF NOT EXISTS member_demo_positions (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    demo_account_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    quantity REAL NOT NULL,
    entry_price REAL NOT NULL,
    current_price REAL NOT NULL,
    unrealized_pnl REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'OPEN',
    decision_id TEXT,
    opened_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (member_id)
      REFERENCES member_accounts(id)
      ON DELETE CASCADE,
    FOREIGN KEY (demo_account_id)
      REFERENCES demo_accounts(id)
      ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_member_demo_positions_member
    ON member_demo_positions(member_id);

  CREATE INDEX IF NOT EXISTS idx_member_demo_positions_account
    ON member_demo_positions(demo_account_id);

  CREATE INDEX IF NOT EXISTS idx_member_demo_positions_status
    ON member_demo_positions(status);

  CREATE TABLE IF NOT EXISTS member_demo_trades (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    demo_account_id TEXT NOT NULL,
    position_id TEXT,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    quantity REAL NOT NULL,
    price REAL NOT NULL,
    realized_pnl REAL NOT NULL DEFAULT 0,
    decision_id TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (member_id)
      REFERENCES member_accounts(id)
      ON DELETE CASCADE,
    FOREIGN KEY (demo_account_id)
      REFERENCES demo_accounts(id)
      ON DELETE CASCADE,
    FOREIGN KEY (position_id)
      REFERENCES member_demo_positions(id)
      ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_member_demo_trades_member
    ON member_demo_trades(member_id);

  CREATE INDEX IF NOT EXISTS idx_member_demo_trades_account
    ON member_demo_trades(demo_account_id);

  CREATE INDEX IF NOT EXISTS idx_member_demo_trades_created
    ON member_demo_trades(created_at);
`);

const positionColumns = db
  .prepare("PRAGMA table_info(positions)")
  .all() as Array<{
    name: string;
  }>;

const hasPositionDecisionId = positionColumns.some(
  (column) => column.name === "decision_id",
);

if (!hasPositionDecisionId) {
  db.exec(
    "ALTER TABLE positions ADD COLUMN decision_id TEXT",
  );
}

const tradeColumns = db
  .prepare("PRAGMA table_info(trades)")
  .all() as Array<{
    name: string;
  }>;

const hasTradeDecisionId = tradeColumns.some(
  (column) => column.name === "decision_id",
);

if (!hasTradeDecisionId) {
  db.exec(
    "ALTER TABLE trades ADD COLUMN decision_id TEXT",
  );
}

export default db;
