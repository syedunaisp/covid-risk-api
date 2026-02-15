"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type RiskLevel = "Low" | "Medium" | "High";

export interface PredictionRecord {
  id: number;
  cases_per_100k: number;
  median_age: number;
  aged_65_above: number;
  risk: RiskLevel;
  timestamp: Date;
}

interface PredictionContextValue {
  predictions: PredictionRecord[];
  addPrediction: (
    input: Omit<PredictionRecord, "id" | "timestamp">,
  ) => void;
}

const PredictionContext = createContext<PredictionContextValue | null>(null);

let nextId = 1;

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);

  const addPrediction = useCallback(
    (input: Omit<PredictionRecord, "id" | "timestamp">) => {
      setPredictions((prev) => [
        { ...input, id: nextId++, timestamp: new Date() },
        ...prev,
      ]);
    },
    [],
  );

  return (
    <PredictionContext.Provider value={{ predictions, addPrediction }}>
      {children}
    </PredictionContext.Provider>
  );
}

export function usePredictions() {
  const ctx = useContext(PredictionContext);
  if (!ctx) {
    throw new Error("usePredictions must be used within PredictionProvider");
  }
  return ctx;
}
