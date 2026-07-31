"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type FocusMarket = {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  score: number;
};

type ContextType = {
  focus: FocusMarket | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setManualFocus: (symbol: string) => Promise<void>;
};

const AIFocusContext =
  createContext<ContextType>({
    focus: null,
    loading: true,
    refresh: async () => {},
    setManualFocus: async () => {},
  });


export function AIFocusProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [focus, setFocus] =
    useState<FocusMarket | null>(null);

  const [loading, setLoading] =
    useState(true);


  async function refresh() {

    try {

      const response =
        await fetch(
          "/api/ai-focus",
          {
            cache: "no-store",
          }
        );


      const result =
        await response.json();


      if(result.success){

        setFocus(
          result.focus
        );

      }


    } catch(error){

      console.error(
        "AI Focus Context:",
        error
      );

    }
    finally{

      setLoading(false);

    }

  }



  async function setManualFocus(
    symbol:string
  ){

    try{

      const response =
        await fetch(
          `/api/ai-focus?symbol=${symbol}&mode=MANUAL`,
          {
            cache:"no-store",
          }
        );


      const result =
        await response.json();


      if(result.success){

        setFocus(
          result.focus
        );

      }


    }
    catch(error){

      console.error(
        "Manual focus error",
        error
      );

    }

  }



  useEffect(()=>{

    refresh();

    // sementara jangan auto refresh
    // karena manual mode harus dikunci dulu

  },[]);



  return (

    <AIFocusContext.Provider

      value={{
        focus,
        loading,
        refresh,
        setManualFocus,
      }}

    >

      {children}

    </AIFocusContext.Provider>

  );

}



export function useAIFocus(){

  return useContext(
    AIFocusContext
  );

}
