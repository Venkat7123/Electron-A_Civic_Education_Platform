import type { Lang } from "@/i18n";

export type ModuleProgress = {
  progress: number;       // 0-100 overall %
  completed: boolean;
  steps: boolean[];       // per-step completion flags
};

export type ProgressState = {
  name: string;
  email: string;
  lang: Lang;
  guidedTouch: boolean;
  modules: Record<1 | 2 | 3 | 4, ModuleProgress>;
  chat: Record<string, { from: "user" | "bot"; text: string; t: number }[]>;
};

const KEY = "electron.progress.v2";

// step counts per module
const STEP_COUNTS: Record<1 | 2 | 3 | 4, number> = { 1: 5, 2: 5, 3: 4, 4: 5 };

function makeModule(id: 1 | 2 | 3 | 4): ModuleProgress {
  return { progress: 0, completed: false, steps: Array(STEP_COUNTS[id]).fill(false) };
}

export const DEFAULT: ProgressState = {
  name: "Friend",
  email: "",
  lang: "en",
  guidedTouch: true,
  modules: {
    1: makeModule(1),
    2: makeModule(2),
    3: makeModule(3),
    4: makeModule(4),
  },
  chat: {},
};

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    // deep-merge to ensure steps arrays exist for each module
    const modules = { ...DEFAULT.modules };
    for (const k of [1, 2, 3, 4] as const) {
      const saved = parsed.modules?.[k];
      if (saved) {
        modules[k] = {
          progress: saved.progress ?? 0,
          completed: saved.completed ?? false,
          steps: Array.isArray(saved.steps) && saved.steps.length === STEP_COUNTS[k]
            ? saved.steps
            : Array(STEP_COUNTS[k]).fill(false),
        };
      }
    }
    return { ...DEFAULT, ...parsed, modules };
  } catch {
    return DEFAULT;
  }
}

export function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save progress to localStorage", error);
  }
}