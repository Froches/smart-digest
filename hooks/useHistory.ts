"use client";

import { useState, useEffect } from "react";
import type { DigestResult } from "@/lib/schema";

export interface HistoryItem extends DigestResult {
  id: string;
  url: string;
  timestamp: number;
}

const STORAGE_KEY = "smart-digest-history";
const MAX_HISTORY_ITEMS = 50;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored) as HistoryItem[]);
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (isHydrated && history.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error("Failed to save history to localStorage:", error);
      }
    }
  }, [history, isHydrated]);

  const addToHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev];
      // Keep only the most recent items
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });

    return newItem;
  };

  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getHistoryItem = (id: string) => {
    return history.find((item) => item.id === id);
  };

  return {
    history,
    isHydrated,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryItem,
  };
}
