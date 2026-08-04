"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  SchedulerResult,
} from "@/lib/types/SchedulerTypes";

type SchedulerContextType = {

  data: SchedulerResult | null;

  loading: boolean;

  refresh: () => Promise<void>;

};

const SchedulerContext =
  createContext<SchedulerContextType | null>(
    null
  );

export function SchedulerProvider({

  children,

}:{

  children: ReactNode;

}){

  const [

    data,

    setData,

  ] =
    useState<SchedulerResult | null>(
      null
    );

  const [

    loading,

    setLoading,

  ] =
    useState(true);

  async function refresh(){

    try{

      setLoading(true);

      const response =
        await fetch(

          "/api/scheduler?symbol=BTCUSDT",

          {

            cache:"no-store",

          }

        );

      const result =
        await response.json();

      if(result.success){

        setData(
          result.data
        );

      }

    }catch(error){

      console.error(

        "Scheduler Context Error",

        error

      );

    }finally{

      setLoading(false);

    }

  }

  useEffect(()=>{

    refresh();

    const timer =
      setInterval(

        refresh,

        5000

      );

    return()=>clearInterval(timer);

  },[]);

  return(

    <SchedulerContext.Provider

      value={{

        data,

        loading,

        refresh,

      }}

    >

      {children}

    </SchedulerContext.Provider>

  );

}

export function useScheduler(){

  const context =
    useContext(
      SchedulerContext
    );

  if(!context){

    throw new Error(

      "useScheduler must be used inside SchedulerProvider"

    );

  }

  return context;

}
