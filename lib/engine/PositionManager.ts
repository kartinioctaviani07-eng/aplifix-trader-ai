export type PositionSide =
  | "BUY"
  | "SELL";

export type PositionStatus =
  | "OPEN"
  | "CLOSED";

export interface Position {
  id: string;

  symbol: string;

  side: PositionSide;

  entryPrice: number;

  currentPrice: number;

  quantity: number;

  stopLoss: number;

  takeProfit: number;

  openedAt: number;

  status: PositionStatus;
}

class PositionManager {

  private positions: Position[];

  constructor() {

    this.positions =
      globalThis.__positionsStore || [];

    globalThis.__positionsStore =
      this.positions;

  }

  openPosition(
    position: Position
  ) {

    if (
      this.hasOpenPosition(
        position.symbol
      )
    ) {

      return false;

    }

    this.positions.push(
      position
    );

    globalThis.__positionsStore =
      this.positions;

    return true;

  }

  hasOpenPosition(
    symbol: string
  ) {

    return this.positions.some(

      (position) =>

        position.symbol === symbol &&
        position.status === "OPEN"

    );

  }

  getPosition(
    symbol: string
  ) {

    return this.positions.find(

      (position) =>

        position.symbol === symbol &&
        position.status === "OPEN"

    ) ?? null;

  }

  canOpenPosition(
    symbol: string
  ) {

    return !this.hasOpenPosition(
      symbol
    );

  }

  updatePrice(
    symbol: string,
    price: number
  ) {

    this.positions =
      this.positions.map(
        (position) => {

          if (

            position.symbol !== symbol ||

            position.status === "CLOSED"

          ) {

            return position;

          }

          return {

            ...position,

            currentPrice: price,

          };

        }
      );

    globalThis.__positionsStore =
      this.positions;

  }

  closePosition(
    id: string
  ) {

    this.positions =
      this.positions.map(
        (position) => {

          if (
            position.id !== id
          ) {

            return position;

          }

          return {

            ...position,

            status: "CLOSED",

          };

        }
      );

    globalThis.__positionsStore =
      this.positions;

  }

  removeClosedPosition() {

    this.positions =
      this.positions.filter(

        (position) =>

          position.status === "OPEN"

      );

    globalThis.__positionsStore =
      this.positions;

  }

  getOpenPositions() {

    return this.positions.filter(

      (position) =>

        position.status === "OPEN"

    );

  }

  getAllPositions() {

    return [
      ...this.positions,
    ];

  }

}

declare global {

  var __positionsStore:
    | Position[]
    | undefined;

}

export const positionManager =
  new PositionManager();
