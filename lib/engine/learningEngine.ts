import {
  aiMemory,
} from "./aiMemory";


import {
  getPerformance,
} from "./performanceEngine";



export function getLearningData() {


  const memory =
    aiMemory.getAll();


  const performance =
    getPerformance();



  let confidenceBonus = 0;



  if (
    performance.winRate >= 70
  ) {

    confidenceBonus += 5;

  }


  if (
    performance.totalProfit > 0
  ) {

    confidenceBonus += 5;

  }



  return {

    totalDecision:
      memory.length,


    lastAction:
      memory.length
        ? memory[memory.length - 1].action
        : null,


    winRate:
      performance.winRate,


    totalProfit:
      performance.totalProfit,


    confidenceBonus,

  };


}
