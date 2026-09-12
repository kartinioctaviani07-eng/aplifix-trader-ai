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

type FocusMode = "AUTO" | "MANUAL";

type ContextType = {
  focus: FocusMarket | null;
  loading: boolean;
  mode: FocusMode;
  refresh: () => Promise<void>;
  setManualFocus: (symbol: string) => Promise<void>;
  setAutoFocus: () => Promise<void>;
};

const AIFocusContext = createContext<ContextType>({
  focus: null,
  loading: true,
  mode: "AUTO",
  refresh: async () => {},
  setManualFocus: async () => {},
  setAutoFocus: async () => {},
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

  const [mode, setMode] =
    useState<FocusMode>("AUTO");

  async function refresh() {
    try {
      const response = await fetch(
        "/api/ai-focus",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("AI Focus API gagal.");
      }

      const result = await response.json();

      if (result.success) {
        setFocus(result.focus ?? null);

        if (
          result.mode === "AUTO" ||
          result.mode === "MANUAL"
        ) {
          setMode(result.mode);
        }
      }
    } catch (error) {
      console.error(
        "AI Focus Context:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function setManualFocus(
    symbol: string
  ) {
    try {
      const response = await fetch(
        `/api/ai-focus?symbol=${encodeURIComponent(
          symbol
        )}&mode=MANUAL`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Manual AI Focus API gagal."
        );
      }

      const result = await response.json();

      if (result.success) {
        setFocus(result.focus ?? null);
        setMode("MANUAL");
      }
    } catch (error) {
      console.error(
        "Manual focus error:",
        error
      );
    }
  }

  async function setAutoFocus() {
    try {
      const response = await fetch(
        "/api/ai-focus?mode=AUTO",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "AUTO AI Focus API gagal."
        );
      }

      const result = await response.json();

      if (result.success) {
        setFocus(result.focus ?? null);
        setMode("AUTO");
      }
    } catch (error) {
      console.error(
        "AUTO focus error:",
        error
      );
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    if (mode !== "AUTO") {
      return;
    }

    const interval = window.setInterval(() => {
      void refresh();
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, [mode]);

  return (
    <AIFocusContext.Provider
      value={{
        focus,
        loading,
        mode,
        refresh,
        setManualFocus,
        setAutoFocus,
      }}
    >
      {children}
    </AIFocusContext.Provider>
  );
}

export function useAIFocus() {
  return useContext(AIFocusContext);
}
