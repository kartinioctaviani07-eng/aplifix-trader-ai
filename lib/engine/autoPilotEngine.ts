import { sql } from "@/lib/db/postgres";
import { runCEO, CEOResult } from "./ceoOrchestrator";

export type AutoPilotStatus =
  | "ACTIVE"
  | "STOPPED";

export type AutoPilotState = {
  id: number;
  status: AutoPilotStatus;
  symbol: string;
  startedAt: number | null;
  stoppedAt: number | null;
  lastRunAt: number | null;
  lastResult: string | null;
  lastError: string | null;
  updatedAt: number;
};

type AutoPilotRow = {
  id: number;
  status: AutoPilotStatus;
  symbol: string;
  started_at: number | null;
  stopped_at: number | null;
  last_run_at: number | null;
  last_result: string | null;
  last_error: string | null;
  updated_at: number;
};

function mapRow(
  row: AutoPilotRow
): AutoPilotState {
  return {
    id: row.id,
    status: row.status,
    symbol: row.symbol,
    startedAt: row.started_at,
    stoppedAt: row.stopped_at,
    lastRunAt: row.last_run_at,
    lastResult: row.last_result,
    lastError: row.last_error,
    updatedAt: row.updated_at,
  };
}

class AutoPilotEngine {
  private async getRow(): Promise<AutoPilotRow> {
    const rows = (await sql`
      SELECT
        id,
        status,
        symbol,
        started_at,
        stopped_at,
        last_run_at,
        last_result,
        last_error,
        updated_at
      FROM auto_pilot
      WHERE id = 1
      LIMIT 1
    `) as unknown as AutoPilotRow[];

    if (rows.length > 0) {
      return rows[0];
    }

    const now = Date.now();

    await sql`
      INSERT INTO auto_pilot (
        id,
        status,
        symbol,
        updated_at
      )
      VALUES (
        1,
        'STOPPED',
        'BTCUSDT',
        ${now}
      )
      ON CONFLICT (id) DO NOTHING
    `;

    const created = (await sql`
      SELECT
        id,
        status,
        symbol,
        started_at,
        stopped_at,
        last_run_at,
        last_result,
        last_error,
        updated_at
      FROM auto_pilot
      WHERE id = 1
      LIMIT 1
    `) as unknown as AutoPilotRow[];

    if (created.length === 0) {
      throw new Error(
        "Auto Pilot state could not be initialized."
      );
    }

    return created[0];
  }

  async getState(): Promise<AutoPilotState> {
    const row = await this.getRow();
    return mapRow(row);
  }

  async activate(
    symbol: string
  ): Promise<AutoPilotState> {
    const normalizedSymbol =
      symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      throw new Error(
        "Symbol Auto Pilot tidak boleh kosong."
      );
    }

    const now = Date.now();

    const rows = (await sql`
      UPDATE auto_pilot
      SET
        status = 'ACTIVE',
        symbol = ${normalizedSymbol},
        started_at = ${now},
        stopped_at = NULL,
        last_error = NULL,
        updated_at = ${now}
      WHERE id = 1
      RETURNING
        id,
        status,
        symbol,
        started_at,
        stopped_at,
        last_run_at,
        last_result,
        last_error,
        updated_at
    `) as unknown as AutoPilotRow[];

    if (rows.length === 0) {
      throw new Error(
        "Auto Pilot state tidak ditemukan."
      );
    }

    return mapRow(rows[0]);
  }

  async stop(): Promise<AutoPilotState> {
    const now = Date.now();

    const rows = (await sql`
      UPDATE auto_pilot
      SET
        status = 'STOPPED',
        stopped_at = ${now},
        updated_at = ${now}
      WHERE id = 1
      RETURNING
        id,
        status,
        symbol,
        started_at,
        stopped_at,
        last_run_at,
        last_result,
        last_error,
        updated_at
    `) as unknown as AutoPilotRow[];

    if (rows.length === 0) {
      throw new Error(
        "Auto Pilot state tidak ditemukan."
      );
    }

    return mapRow(rows[0]);
  }

  async runCycle(): Promise<{
    executed: boolean;
    state: AutoPilotState;
    result?: CEOResult;
    message: string;
  }> {
    const state = await this.getState();

    if (state.status !== "ACTIVE") {
      return {
        executed: false,
        state,
        message:
          "Auto Pilot STOPPED. Tidak ada trading yang dijalankan.",
      };
    }

    const startedAt = Date.now();

    try {
      const result = await runCEO(
        state.symbol
      );

      const resultText =
        result.executed
          ? `EXECUTED: ${result.action}`
          : `NO TRADE: ${result.message}`;

      const updatedAt = Date.now();

      await sql`
        UPDATE auto_pilot
        SET
          last_run_at = ${startedAt},
          last_result = ${resultText},
          last_error = NULL,
          updated_at = ${updatedAt}
        WHERE id = 1
      `;

      const updatedState =
        await this.getState();

      return {
        executed: result.executed,
        state: updatedState,
        result,
        message: resultText,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Auto Pilot cycle gagal.";

      const updatedAt = Date.now();

      await sql`
        UPDATE auto_pilot
        SET
          last_run_at = ${startedAt},
          last_error = ${message},
          updated_at = ${updatedAt}
        WHERE id = 1
      `;

      const updatedState =
        await this.getState();

      return {
        executed: false,
        state: updatedState,
        message,
      };
    }
  }
}

export const autoPilotEngine =
  new AutoPilotEngine();
