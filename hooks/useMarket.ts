"use client";

import { useEffect, useState } from "react";
import { marketService } from "@/lib/services/marketService";

export function useMarket() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMarket() {
    try {
      const data = await marketService.getWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error(
        "Failed to load market:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMarket();

    const interval = setInterval(() => {
      loadMarket();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    watchlist,
    loading,
    reload: loadMarket,
  };
}
