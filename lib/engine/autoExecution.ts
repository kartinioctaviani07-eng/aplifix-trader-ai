import {
  runAutoController,
} from "./autoController";

export async function runAutoExecution(
  symbol: string
) {

  const result =
    await runAutoController(
      symbol
    );

  if (
    !result.executed
  ) {

    return result;

  }

  if (
    result.action !== "BUY"
  ) {

    return {

      executed: false,

      message:
        "Tidak ada BUY yang dieksekusi.",

    };

  }

  return {

    executed: true,

    message:
      "Auto Execution berhasil.",

    result,

  };

}
