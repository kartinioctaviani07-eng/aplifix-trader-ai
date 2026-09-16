CREATE TABLE IF NOT EXISTS member_accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_member_accounts_status
  ON member_accounts(status);

CREATE INDEX IF NOT EXISTS idx_member_accounts_created
  ON member_accounts(created_at);


CREATE TABLE IF NOT EXISTS account (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  initial_balance DOUBLE PRECISION NOT NULL,
  balance DOUBLE PRECISION NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);


CREATE TABLE IF NOT EXISTS positions (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL,
  entry_price DOUBLE PRECISION NOT NULL,
  current_price DOUBLE PRECISION NOT NULL,
  quantity DOUBLE PRECISION NOT NULL,
  stop_loss DOUBLE PRECISION NOT NULL,
  take_profit DOUBLE PRECISION NOT NULL,
  opened_at BIGINT NOT NULL,
  status TEXT NOT NULL,
  decision_id TEXT
);


CREATE TABLE IF NOT EXISTS trades (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL,
  entry_price DOUBLE PRECISION NOT NULL,
  exit_price DOUBLE PRECISION NOT NULL,
  quantity DOUBLE PRECISION NOT NULL,
  profit DOUBLE PRECISION NOT NULL,
  profit_percent DOUBLE PRECISION NOT NULL,
  result TEXT NOT NULL,
  opened_at BIGINT NOT NULL,
  closed_at BIGINT NOT NULL,
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
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);


CREATE TABLE IF NOT EXISTS partnership_status_history (
  id TEXT PRIMARY KEY,
  partnership_id TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  created_at BIGINT NOT NULL,

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
  confidence DOUBLE PRECISION NOT NULL,
  reasons TEXT NOT NULL,
  trend TEXT,
  ema20 DOUBLE PRECISION,
  ema50 DOUBLE PRECISION,
  rsi DOUBLE PRECISION,
  macd DOUBLE PRECISION,
  atr DOUBLE PRECISION,
  market_condition TEXT,
  entry_price DOUBLE PRECISION,
  exit_price DOUBLE PRECISION,
  profit DOUBLE PRECISION,
  duration BIGINT,
  result TEXT,
  timestamp BIGINT NOT NULL
);


CREATE TABLE IF NOT EXISTS member_payments (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  payment_method TEXT NOT NULL,
  proof_path TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  submitted_at BIGINT,
  reviewed_at BIGINT,
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
  initial_balance DOUBLE PRECISION NOT NULL,
  balance DOUBLE PRECISION NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,

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
  quantity DOUBLE PRECISION NOT NULL,
  entry_price DOUBLE PRECISION NOT NULL,
  current_price DOUBLE PRECISION NOT NULL,
  unrealized_pnl DOUBLE PRECISION NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'OPEN',
  decision_id TEXT,
  opened_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,

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
  quantity DOUBLE PRECISION NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  realized_pnl DOUBLE PRECISION NOT NULL DEFAULT 0,
  decision_id TEXT,
  created_at BIGINT NOT NULL,

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


CREATE TABLE IF NOT EXISTS ai_activity_logs (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  action TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  total_score DOUBLE PRECISION NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  risk_level TEXT NOT NULL,
  trend TEXT,
  reasons TEXT NOT NULL,
  execution_status TEXT NOT NULL,
  execution_reason TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  created_at BIGINT NOT NULL,

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
