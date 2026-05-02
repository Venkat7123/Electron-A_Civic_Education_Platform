import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useProgress } from "@/hooks/useProgress";

export type Gesture = "tap" | "swipe" | "drag";
export type Step = { id: string; targetId: string; hint: string; gesture: Gesture };

type Ctx = {
  setSteps: (steps: Step[]) => void;
  setActive: (id: string | null) => void;
  activeId: string | null;
  enabled: boolean;
  toggle: () => void;
  replay: () => void;
};

const GTCtx = createContext<Ctx | null>(null);

export function GuidedTouchProvider({ children }: { children: ReactNode }) {
  const { state, setGuidedTouch } = useProgress();
  const [steps, setSteps] = useState<Step[]>([]);
  const [activeId, setActive] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [hint, setHint] = useState<string>("");
  const [gesture, setGesture] = useState<Gesture>("tap");
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);

  const recompute = useCallback(() => {
    if (!activeId || !state.guidedTouch) { setPos(null); return; }
    const step = steps.find(s => s.id === activeId);
    if (!step) { setPos(null); return; }
    const el = document.querySelector(`[data-gt-id="${step.targetId}"]`) as HTMLElement | null;
    if (!el) { setPos(null); return; }
    const r = el.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setHint(step.hint);
    setGesture(step.gesture);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, steps, state.guidedTouch, tick]);

  useEffect(() => { recompute(); }, [recompute]);

  useEffect(() => {
    const onChange = () => setTick(t => t + 1);
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    const id = window.setInterval(onChange, 600);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
      window.clearInterval(id);
    };
  }, []);

  const replay = useCallback(() => {
    setTick(t => t + 1);
  }, []);

  const toggle = useCallback(() => setGuidedTouch(!state.guidedTouch), [state.guidedTouch, setGuidedTouch]);

  return (
    <GTCtx.Provider value={{ setSteps, setActive, activeId, enabled: state.guidedTouch, toggle, replay }}>
      {children}
      {state.guidedTouch && pos && (
        <>
          {/* spotlight */}
          <div
            className="pointer-events-none fixed z-[60] rounded-full"
            style={{
              left: pos.x - 60,
              top: pos.y - 60,
              width: 120,
              height: 120,
              boxShadow: "0 0 0 9999px hsl(220 50% 8% / 0.35)",
              transition: "left .5s cubic-bezier(.4,0,.2,1), top .5s cubic-bezier(.4,0,.2,1)",
            }}
          />
          {/* ring */}
          <div
            className="pointer-events-none fixed z-[61] rounded-full border-2 border-primary"
            style={{
              left: pos.x - 44,
              top: pos.y - 44,
              width: 88,
              height: 88,
              boxShadow: "0 0 0 6px hsl(var(--primary) / 0.25)",
              transition: "left .5s cubic-bezier(.4,0,.2,1), top .5s cubic-bezier(.4,0,.2,1)",
            }}
          />
          {/* tap ripple */}
          <div
            className="pointer-events-none fixed z-[61] rounded-full bg-primary/30"
            style={{
              left: pos.x - 30, top: pos.y - 30, width: 60, height: 60,
              animation: "tap-ripple 1.4s ease-out infinite",
              transition: "left .5s, top .5s",
            }}
          />
          {/* hand */}
          <div
            className="pointer-events-none fixed z-[62]"
            style={{
              left: pos.x + 8, top: pos.y + 8,
              animation: "hand-tap 1.4s ease-in-out infinite",
              transition: "left .5s, top .5s",
            }}
          >
            <HandSvg />
          </div>
          {/* hint bubble */}
          <div
            className="pointer-events-none fixed z-[63] max-w-[240px] rounded-2xl bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-card"
            style={{
              left: pos.x + 60,
              top: pos.y - 28,
              transition: "left .5s, top .5s",
            }}
          >
            <div className="absolute -left-1.5 top-3 h-3 w-3 rotate-45 bg-foreground" />
            {hint}
            <div className="mt-0.5 text-[10px] uppercase tracking-wide opacity-60">{gesture}</div>
          </div>
        </>
      )}
    </GTCtx.Provider>
  );
}

function HandSvg() {
  return (
    <svg width="48" height="56" viewBox="0 0 48 56" aria-hidden>
      <g>
        <path
          d="M14 6 C14 3, 18 3, 18 6 L18 26 L20 26 L20 14 C20 11, 24 11, 24 14 L24 28 L26 28 L26 18 C26 15, 30 15, 30 18 L30 30 L32 30 C32 28, 36 27, 36 30 L36 42 C36 50, 30 54, 22 54 C14 54, 10 49, 10 42 L10 22 C10 19, 14 19, 14 22 Z"
          fill="white"
          stroke="hsl(220 60% 30%)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function useGuidedTouch() {
  const ctx = useContext(GTCtx);
  if (!ctx) throw new Error("useGuidedTouch must be used inside GuidedTouchProvider");
  return ctx;
}

/** Convenience hook: declare steps for the current screen and which is active. */
export function useGuidedSteps(steps: Step[], activeId: string | null) {
  const { setSteps, setActive } = useGuidedTouch();
  useEffect(() => {
    setSteps(steps);
    return () => setSteps([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(steps)]);
  useEffect(() => { setActive(activeId); }, [activeId, setActive]);
}