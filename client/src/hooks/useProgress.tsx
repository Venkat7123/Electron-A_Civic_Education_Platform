import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loadProgress, saveProgress, DEFAULT, type ProgressState } from "@/lib/storage";
import { syncUserProgress, fetchUserProgress, logChatMessage } from "@/gcp/firestore";
import { auth } from "@/gcp/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { Lang } from "@/i18n";

type Ctx = {
  state: ProgressState;
  setName: (n: string) => void;
  setEmail: (e: string) => void;
  setLang: (l: Lang) => void;
  setGuidedTouch: (v: boolean) => void;
  /** Mark a specific step done and recalculate module progress */
  updateStep: (moduleId: 1 | 2 | 3 | 4, stepIndex: number) => void;
  /** Legacy: set overall progress + completion directly */
  updateModule: (id: 1 | 2 | 3 | 4, progress: number, completed?: boolean) => void;
  pushChat: (moduleKey: string, msg: { from: "user" | "bot"; text: string }) => void;
  overall: number;
  reset: () => void;
};

const ProgressCtx = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadProgress());
  const [userUid, setUserUid] = useState<string | null>(null);

  // Load remote progress when user logs in
  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const remoteState = await fetchUserProgress(user.uid);
        if (!active) return;
        
        if (remoteState) {
          setState(prev => {
            // Merge remote into local — remote wins for completed modules
            const merged = { ...prev, ...remoteState };
            return merged;
          });
        }
        // Set UID ONLY AFTER fetching is done to prevent premature sync
        setUserUid(user.uid);
      } else {
        if (active) setUserUid(null);
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Persist every state change to localStorage + Firestore
  useEffect(() => {
    saveProgress(state);
    if (userUid) {
      syncUserProgress(userUid, state).catch(console.error);
    }
  }, [state, userUid]);

  const setName        = useCallback((n: string) => setState(s => ({ ...s, name: n })), []);
  const setEmail       = useCallback((e: string) => setState(s => ({ ...s, email: e })), []);
  const setLang        = useCallback((l: Lang)   => setState(s => ({ ...s, lang: l })), []);
  const setGuidedTouch = useCallback((v: boolean) => setState(s => ({ ...s, guidedTouch: v })), []);

  /** Mark a single step complete, recalculate module progress percentage */
  const updateStep = useCallback((moduleId: 1 | 2 | 3 | 4, stepIndex: number) => {
    setState(s => {
      const mod = s.modules[moduleId];
      const steps = [...mod.steps];
      steps[stepIndex] = true;
      const progress = Math.round((steps.filter(Boolean).length / steps.length) * 100);
      const completed = progress === 100;
      return {
        ...s,
        modules: {
          ...s.modules,
          [moduleId]: { ...mod, steps, progress, completed },
        },
      };
    });
  }, []);

  /** Legacy compat — used by old module pages */
  const updateModule = useCallback((id: 1 | 2 | 3 | 4, progress: number, completed?: boolean) => {
    setState(s => ({
      ...s,
      modules: {
        ...s.modules,
        [id]: { ...s.modules[id], progress, completed: completed ?? s.modules[id].completed },
      },
    }));
  }, []);

  const pushChat = useCallback((moduleKey: string, msg: { from: "user" | "bot"; text: string }) => {
    setState(s => ({
      ...s,
      chat: {
        ...s.chat,
        [moduleKey]: [...(s.chat[moduleKey] ?? []), { ...msg, t: Date.now() }],
      },
    }));
    if (userUid) logChatMessage(userUid, moduleKey, msg).catch(console.error);
  }, [userUid]);

  const reset = useCallback(() => setState(DEFAULT), []);

  const overall = useMemo(() => {
    const ms = Object.values(state.modules);
    return Math.round(ms.reduce((a, m) => a + m.progress, 0) / ms.length);
  }, [state.modules]);

  return (
    <ProgressCtx.Provider value={{ state, setName, setEmail, setLang, setGuidedTouch, updateStep, updateModule, pushChat, overall, reset }}>
      {children}
    </ProgressCtx.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}