import {
  TechnicalAnalysis,
} from "@/lib/services/technicalAnalysisService";

import {
  RiskResult,
} from "./riskEngine";

import {
  DecisionResult,
} from "./decisionEngine";


export type AISignal = {

  signal:
    | "BUY"
    | "SELL"
    | "WAIT";

  strength:
    | "WEAK"
    | "MEDIUM"
    | "STRONG";

  confidence: number;

  marketCondition: string;

  summary: string;

  reasons: string[];

};



export function generateSignal(
  technical: TechnicalAnalysis,
  risk: RiskResult,
  decision: DecisionResult
): AISignal {


  const reasons:string[] = [
    ...decision.reason,
    ...risk.reasons,
  ];



  /*
    MOMENTUM CHECK
  */


  if(
    technical.macd.trend === "BULLISH"
  ){

    reasons.push(
      "MACD mendukung momentum bullish."
    );

  }


  if(
    technical.macd.trend === "BEARISH"
  ){

    reasons.push(
      "MACD menunjukkan tekanan bearish."
    );

  }



  /*
    RSI CHECK
  */


  if(
    technical.rsi.status === "OVERSOLD"
  ){

    reasons.push(
      "RSI menunjukkan area oversold, peluang rebound perlu diperhatikan."
    );

  }


  if(
    technical.rsi.status === "OVERBOUGHT"
  ){

    reasons.push(
      "RSI menunjukkan area overbought, risiko koreksi meningkat."
    );

  }


  if(
    technical.rsi.status === "NEUTRAL"
  ){

    reasons.push(
      "RSI masih netral, momentum belum ekstrem."
    );

  }



  /*
    VOLATILITY
  */


  if(
    technical.atr.volatility === "HIGH"
  ){

    reasons.push(
      "Volatilitas tinggi, gunakan manajemen risiko ketat."
    );

  }



  /*
    MARKET CONDITION
  */


  let marketCondition =
    "SIDEWAYS";


  if(
    technical.indicators.trend === "Bullish"
  ){

    marketCondition =
      "BULLISH TREND";

  }


  if(
    technical.indicators.trend === "Bearish"
  ){

    marketCondition =
      "BEARISH TREND";

  }



  /*
    SIGNAL STRENGTH
  */


  let strength:
    | "WEAK"
    | "MEDIUM"
    | "STRONG";


  if(
    decision.confidence >= 85 &&
    technical.rsi.status !== "OVERBOUGHT"
  ){

    strength =
      "STRONG";

  }

  else if(
    decision.confidence >= 60
  ){

    strength =
      "MEDIUM";

  }

  else {

    strength =
      "WEAK";

  }



  /*
    SUMMARY
  */


  let summary =
    "AI menunggu konfirmasi tambahan sebelum mengambil posisi.";


  if(
    decision.action === "BUY"
  ){

    summary =
      "Trend dan sentimen mendukung BUY, namun AI tetap memantau momentum.";

  }


  if(
    decision.action === "SELL"
  ){

    summary =
      "Tekanan jual lebih dominan berdasarkan analisa AI.";

  }



  return {

    signal:
      decision.action === "HOLD"
      ? "WAIT"
      : decision.action,


    strength,


    confidence:
      decision.confidence,


    marketCondition,


    summary,


    reasons,

  };


}
