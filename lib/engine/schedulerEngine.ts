import { aiCore } from "./aiCore";

export type SchedulerResult =
  Awaited<
    ReturnType<
      typeof aiCore.analyze
    >
  >;

class SchedulerEngine {

  private running = false;

  async tick(
    symbol: string
  ): Promise<SchedulerResult> {

    return await aiCore.analyze(
      symbol
    );

  }

  async start(
    symbol: string
  ) {

    if (
      this.running
    ) {

      return;

    }

    this.running = true;

    while (
      this.running
    ) {

      try {

        await this.tick(
          symbol
        );

      } catch (
        error
      ) {

        console.error(
          "Scheduler Error:",
          error
        );

      }

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            5000
          )
      );

    }

  }

  stop() {

    this.running = false;

  }

  isRunning() {

    return this.running;

  }

}

export const schedulerEngine =
  new SchedulerEngine();
