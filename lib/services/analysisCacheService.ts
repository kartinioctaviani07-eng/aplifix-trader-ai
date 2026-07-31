import {
  analysisService,
} from "./analysisService";


type CacheData = {

  data: any;

  timestamp: number;

};



class AnalysisCacheService {


  private cache:
    Map<string, CacheData> =
    new Map();


  private expiry =
    60000;



  async getAnalysis(
    symbol: string = "BTCUSDT"
  ) {


    const now =
      Date.now();


    const cached =
      this.cache.get(
        symbol
      );


    if (
      cached &&
      now - cached.timestamp <
      this.expiry
    ) {

      return cached.data;

    }



    const result =
      await analysisService.analyze(
        symbol
      );



    this.cache.set(

      symbol,

      {

        data: result,

        timestamp: now,

      }

    );



    return result;

  }


}


export const analysisCacheService =
  new AnalysisCacheService();
