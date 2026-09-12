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

import {
  useAIFocus,
} from "@/context/AIFocusContext";

type SchedulerContextType = {
  data: SchedulerResult | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const SchedulerContext =
  createContext<SchedulerContextType | null>(null);

export function SchedulerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { focus } = useAIFocus();

  const [data, setData] =
    useState<SchedulerResult | null>(null);

  const [loading, setLoading] =
    useState(true);

  const symbol =
    focus?.symbol ?? "BTCUSDT";

  useEffect(() => {
    let cancelled = false;

    async function loadScheduler() {
      try {
        setLoading(true);

        const response =
          await fetch(
            `/api/scheduler?symbol=${encodeURIComponent(symbol)}`,
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Scheduler API gagal."
          );
        }

        const result =
          await response.json();

        if (
          cancelled
        ) {
          return;
        }

        if (
          result.success &&
          result.data
        ) {
          setData(
            result.data
          );
        } else {
          setData(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Scheduler Context Error:",
            error
          );

          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadScheduler();

    const timer =
      window.setInterval(
        () => {
          void loadScheduler();
        },
        15000
      );

    return () => {
      cancelled = true;

      window.clearInterval(
        timer
      );
    };
  }, [symbol]);

  async function refresh(): Promise<void> {
    try {
      setLoading(true);

      const response =
        await fetch(
          `/api/scheduler?symbol=${encodeURIComponent(symbol)}`,
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Scheduler API gagal."
        );
      }

      const result =
        await response.json();

      if (
        result.success &&
        result.data
      ) {
        setData(
          result.data
        );
      } else {
        setData(null);
      }
    } catch (error) {
      console.error(
        "Scheduler Refresh Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
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

export function useScheduler() {
  const context =
    useContext(
      SchedulerContext
    );

  if (!context) {
    throw new Error(
      "useScheduler must be used inside SchedulerProvider"
    );
  }

  return context;
}
