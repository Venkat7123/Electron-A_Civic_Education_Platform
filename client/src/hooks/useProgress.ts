import { createContext, useContext } from "react";
import type { ProgressState } from "@/lib/storage";
import type { Lang } from "@/i18n";

export type ProgressContextType = {
  state: ProgressState;
  setName: (n: string) => void;
  setEmail: (e: string) => void;
  setLang: (l: Lang) => void;
  setGuidedTouch: (v: boolean) => void;
  updateStep: (moduleId: 1 | 2 | 3 | 4, stepIndex: number) => void;
  updateModule: (id: 1 | 2 | 3 | 4, progress: number, completed?: boolean) => void;
  pushChat: (moduleKey: string, msg: { from: "user" | "bot"; text: string }) => void;
  overall: number;
  reset: () => void;
};

export const ProgressCtx = createContext<ProgressContextType | null>(null);

export function useProgress() {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
