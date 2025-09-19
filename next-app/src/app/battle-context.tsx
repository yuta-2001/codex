"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Contenders = {
  a: { url: string };
  b: { url: string };
};

export type BattleEvaluation = {
  category: string;
  winner: "A" | "B";
  reason: string;
};

export type ShopDetail = {
  name: string;
  markdown: string;
};

export type BattleResult = {
  winner: "A" | "B";
  summary: string;
  evaluations: BattleEvaluation[];
  shopDetails: {
    A: ShopDetail;
    B: ShopDetail;
  };
};

type BattlePhase = "idle" | "battling" | "completed";

type BattleContextValue = {
  contenders: Contenders | null;
  result: BattleResult | null;
  phase: BattlePhase;
  startBattle: (payload: Contenders) => void;
  resolveBattle: (result: BattleResult) => void;
  reset: () => void;
};

const BattleContext = createContext<BattleContextValue | undefined>(undefined);

export function BattleProvider({ children }: { children: React.ReactNode }) {
  const [contenders, setContenders] = useState<Contenders | null>(null);
  const [result, setResult] = useState<BattleResult | null>(null);
  const [phase, setPhase] = useState<BattlePhase>("idle");

  const startBattle = useCallback((payload: Contenders) => {
    setContenders(payload);
    setResult(null);
    setPhase("battling");
  }, []);

  const resolveBattle = useCallback((battleResult: BattleResult) => {
    setResult(battleResult);
    setPhase("completed");
  }, []);

  const reset = useCallback(() => {
    setContenders(null);
    setResult(null);
    setPhase("idle");
  }, []);

  const value = useMemo(
    () => ({
      contenders,
      result,
      phase,
      startBattle,
      resolveBattle,
      reset,
    }),
    [contenders, phase, resolveBattle, result, startBattle, reset],
  );

  return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
}

export function useBattle() {
  const context = useContext(BattleContext);
  if (!context) {
    throw new Error("useBattle must be used within a BattleProvider");
  }
  return context;
}
