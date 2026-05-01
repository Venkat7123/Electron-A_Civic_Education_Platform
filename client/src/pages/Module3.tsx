import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, PartyPopper, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ElectronAvatar } from "@/components/ElectronAvatar";
import { useGuidedSteps, useGuidedTouch } from "@/components/guided-touch/GuidedTouch";
import { useProgress } from "@/hooks/useProgress";
import { useT } from "@/hooks/useT";
import { VoicePanel } from "@/components/VoicePanel";
import { useModuleText } from "@/lib/moduleTexts";

const MODULE_ID = 3 as const;

const STEPS = [
  { key: "enter", titleKey: "m3_s1_title" as const },
  { key: "ink",   titleKey: "m3_s2_title" as const },
  { key: "evm",   titleKey: "m3_s3_title" as const },
  { key: "recap", titleKey: "m3_s4_title" as const },
];

export default function Module3() {
  const t = useT();
  const txt = useModuleText();
  const nav = useNavigate();
  const { state, updateStep } = useProgress();
  const [chat, setChat] = useState(false);
  const { enabled, toggle, replay } = useGuidedTouch();

  const savedSteps = state.modules[MODULE_ID].steps;
  const [done, setDone] = useState<boolean[]>(
    savedSteps.length === STEPS.length ? [...savedSteps] : Array(STEPS.length).fill(false)
  );
  const [step, setStep] = useState(() => {
    const last = savedSteps.lastIndexOf(true);
    return last === -1 ? 0 : Math.min(last + 1, STEPS.length - 1);
  });

  const markDone = (i: number) => {
    setDone(d => { if (d[i]) return d; const n = [...d]; n[i] = true; return n; });
    updateStep(MODULE_ID, i);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <AppHeader onChat={() => setChat(!chat)} showProgress />
      <main className="container py-6">
        <div className="mb-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => nav("/dashboard")}>
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1.5" onClick={replay}>
              <RefreshCw className="h-3.5 w-3.5" /> {t("showMe")}
            </Button>
            <Button size="sm" variant={enabled ? "default" : "outline"} onClick={toggle}>
              Guided: {enabled ? "ON" : "OFF"}
            </Button>
          </div>
        </div>

        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {txt.m3_title}
        </h2>

        <div className="mt-3 grid grid-cols-12 gap-5">
          <aside className="col-span-12 rounded-2xl border bg-card p-4 shadow-card md:col-span-3">
            <h3 className="mb-3 text-sm font-semibold">Steps</h3>
            <ul className="space-y-1.5">
              {STEPS.map((s, i) => (
                <li key={s.key}>
                  <button onClick={() => setStep(i)}
                    disabled={i > 0 && !done[i - 1]}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-all ${i === step ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary"} ${i > 0 && !done[i - 1] ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${done[i] ? "bg-success text-success-foreground" : "bg-secondary text-foreground"}`}>
                      {done[i] ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    {txt[s.titleKey]}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="col-span-12 rounded-2xl border bg-card p-6 shadow-card md:col-span-9">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                {txt[STEPS[step].titleKey]}
              </h3>
              <div className="flex gap-1">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-1.5 w-10 rounded-full ${i <= step ? "bg-success" : "bg-secondary"}`} />
                ))}
              </div>
            </div>

            <div key={step} className="animate-fade-in">
              {step === 0 && <EnterStation onDone={() => markDone(0)} />}
              {step === 1 && <IndelibleInk onDone={() => markDone(1)} />}
              {step === 2 && <EvmVvpat onDone={() => markDone(2)} />}
              {step === 3 && <Recap3 onComplete={() => { confetti({ particleCount: 150, spread: 100 }); markDone(3); }} />}
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <Button variant="ghost" size="sm" onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0}>
                <ChevronLeft className="h-4 w-4" /> {t("back")}
              </Button>
              <p className="text-xs text-muted-foreground">{t("guidedFooter")}</p>
              {step < STEPS.length - 1
                ? <Button size="sm" onClick={() => setStep(s => Math.min(s + 1, STEPS.length - 1))} disabled={!done[step]}>
                    {t("next")} <ChevronRight className="h-4 w-4" />
                  </Button>
                : <Button size="sm" onClick={() => nav("/dashboard")}>{t("finish")}</Button>}
            </div>
          </section>
        </div>
      </main>
      <ChatSidebar open={chat} onClose={() => setChat(false)} moduleKey="module-3" contextLabel={txt[STEPS[step].titleKey]} />
      <VoicePanel moduleId={MODULE_ID} step={step} />
    </div>
  );
}

/* ── Step 3.1 Entering the Station ── */
function EnterStation({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const [progress, setProgress] = useState(0);
  const [idShown, setIdShown] = useState(false);
  const [inside, setInside] = useState(false);
  const dragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useGuidedSteps(
    [{ id: "swipe-enter", targetId: "gt-enter-thumb", hint: txt.m3_s1_desc, gesture: "swipe" }],
    inside ? null : "swipe-enter"
  );

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setProgress(pct);
    if (pct >= 50 && !idShown) setIdShown(true);
    if (pct >= 98 && !inside) { setInside(true); onDone(); }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {txt.m3_s1_desc}
      </p>

      {/* Scene */}
      <div className="relative w-full max-w-lg h-36 rounded-2xl overflow-hidden border border-slate-200"
        style={{ background: "linear-gradient(180deg, #e0f2fe 0%, #f0fdf4 100%)" }}>
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-200 rounded-b-2xl" />
        {/* School building */}
        <div className="absolute right-6 bottom-10 flex flex-col items-center">
          <div className="w-28 h-20 bg-amber-100 border-2 border-amber-300 rounded-t-lg flex flex-col items-center justify-center">
            <p className="text-[9px] font-bold text-amber-800 text-center leading-tight">GOVT.<br/>SCHOOL<br/>🗳️ BOOTH</p>
          </div>
          <div className="w-10 h-12 bg-amber-200 border-2 border-amber-300 mx-auto -mt-0.5" />
        </div>
        {/* Polling officer at door */}
        {idShown && (
          <div className="absolute right-20 bottom-10 text-2xl animate-scale-in">👮</div>
        )}
        {/* Electron avatar walking */}
        <div className="absolute bottom-10 text-3xl transition-all duration-100"
          style={{ left: `${Math.max(4, Math.min(progress * 0.65, 65))}%` }}>
          {inside ? "🎉" : "🧑"}
        </div>
      </div>

      {/* Slider */}
      <div ref={trackRef} className="relative w-full max-w-lg h-12 rounded-full bg-secondary cursor-pointer select-none"
        onPointerDown={() => { dragging.current = true; }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerLeave={() => { dragging.current = false; }}
        onPointerMove={onPointerMove}>
        <div className="absolute inset-y-0 left-0 rounded-full bg-primary/30 transition-all" style={{ width: `${progress}%` }} />
        <div data-gt-id="gt-enter-thumb"
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-primary shadow-lg flex items-center justify-center text-white cursor-grab active:cursor-grabbing transition-all"
          style={{ left: `${progress}%` }}>
          {inside ? <Check className="h-5 w-5" /> : "→"}
        </div>
        <p className="absolute inset-0 flex items-center justify-center text-xs font-medium text-muted-foreground pointer-events-none">
          {inside ? "Inside the booth!" : idShown ? "Show your Voter ID to the officer →" : "Slide to walk in →"}
        </p>
      </div>

      {idShown && !inside && (
        <div className="animate-scale-in rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-xs text-blue-800 max-w-md w-full text-center">
          <strong>Polling Officer</strong> checks your name in the electoral roll and marks it. <strong>Polling Agent</strong> (party representative) observes the process.
        </div>
      )}

      {inside && (
        <div className="animate-scale-in rounded-xl bg-success/15 px-4 py-2 text-sm font-bold text-success text-center">
          ✅ Identity verified! You may now proceed to vote.
        </div>
      )}
    </div>
  );
}

/* ── Step 3.2 Indelible Ink ── */
function IndelibleInk({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const [marked, setMarked] = useState(false);
  const [dripping, setDripping] = useState(false);

  useGuidedSteps(
    [{ id: "ink", targetId: "gt-ink-bottle", hint: txt.m3_s2_desc, gesture: "tap" }],
    marked ? null : "ink"
  );

  const applyInk = () => {
    if (marked) return;
    setDripping(true);
    setTimeout(() => { setMarked(true); onDone(); }, 800);
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="max-w-md text-sm text-muted-foreground">
        {txt.m3_s2_desc}
      </p>

      <div className="flex items-end gap-10">
        {/* Ink bottle */}
        <button data-gt-id="gt-ink-bottle" onClick={applyInk} disabled={marked}
          className={`flex flex-col items-center gap-1 transition ${!marked ? "hover:scale-110 active:scale-95 cursor-pointer" : "cursor-default opacity-50"}`}
          aria-label="Apply indelible ink">
          <div className="relative">
            <div className="w-12 h-6 rounded-t-full bg-violet-800 mx-auto" />
            <div className="w-16 h-20 rounded-xl bg-violet-700 shadow-lg flex items-center justify-center">
              <span className="text-white text-2xl">🖌️</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-4 bg-violet-500 rounded-b" />
            {dripping && !marked && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2 h-6 rounded-b-full bg-violet-500 animate-pulse" />
            )}
          </div>
          <p className="text-xs font-semibold text-violet-700">Indelible Ink</p>
        </button>

        {/* Finger */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-14 h-32 rounded-t-full rounded-b-xl bg-amber-200 border-2 border-amber-300 flex items-end justify-center pb-3">
            {marked && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-violet-600 opacity-90 animate-scale-in flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">✓</span>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Left index finger</p>
        </div>
      </div>

      {marked && (
        <div className="animate-scale-in rounded-xl bg-violet-50 border border-violet-200 px-5 py-3 text-left max-w-sm w-full">
          <p className="text-sm font-bold text-violet-800">🗓️ Did You Know?</p>
          <ul className="mt-1 space-y-1 text-xs text-violet-700">
            <li>• Indelible ink has been used in Indian elections since <strong>1962</strong>.</li>
            <li>• It is manufactured by <strong>Mysore Paints & Varnish Ltd.</strong></li>
            <li>• The mark stays for <strong>2–4 weeks</strong> and cannot be washed off.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Step 3.3 EVM + VVPAT ── */
const CANDIDATES = [
  { id: "c1", symbol: "🥳", name: "Whitsle Party",   color: "bg-yellow-50 border-red-200" },
  { id: "c2", symbol: "☀️", name: "Sun Party",    color: "bg-red-50 border-black-200" },
  { id: "c3", symbol: "🍀", name: "Leaf Party",   color: "bg-green-50 border-green-200" },
];

function EvmVvpat({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const [chosen, setChosen] = useState<string | null>(null);
  const [vvpatOpen, setVvpatOpen] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const [vvpatDone, setVvpatDone] = useState(false);

  useGuidedSteps(
    [{ id: "evm-btn", targetId: "gt-evm-c1", hint: txt.m3_s3_instruction, gesture: "tap" }],
    chosen ? null : "evm-btn"
  );

  const vote = (id: string) => {
    if (chosen) return;
    setChosen(id);
    setTimeout(() => {
      setVvpatOpen(true);
      let t = 7;
      const iv = setInterval(() => {
        t--;
        setCountdown(t);
        if (t <= 0) {
          clearInterval(iv);
          setVvpatOpen(false);
          setVvpatDone(true);
          onDone();
        }
      }, 1000);
    }, 600);
  };

  const candidate = CANDIDATES.find(c => c.id === chosen);

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {txt.m3_s3_desc}
      </p>

      <div className="flex gap-6 flex-wrap justify-center">
        {/* Ballot Unit */}
        <div className="w-56 rounded-2xl border-2 border-slate-300 bg-slate-50 p-3 shadow-lg">
          <div className="mb-2 rounded-lg bg-slate-200 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Ballot Unit
          </div>
          <div className="space-y-2">
            {CANDIDATES.map((c, idx) => (
              <div key={c.id} className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 transition ${chosen === c.id ? "border-primary bg-primary/5" : c.color}`}>
                <span className="text-xl">{c.symbol}</span>
                <span className="flex-1 text-xs font-semibold">{c.name}</span>
                <button
                  data-gt-id={idx === 0 ? "gt-evm-c1" : undefined}
                  onClick={() => vote(c.id)}
                  disabled={!!chosen}
                  className={`h-7 w-7 rounded-full border-2 border-blue-600 bg-blue-600 text-white text-xs font-bold shadow transition
                    ${!chosen ? "hover:bg-blue-700 active:scale-90" : "opacity-50 cursor-not-allowed"}
                    ${chosen === c.id ? "ring-2 ring-primary ring-offset-1" : ""}`}
                  aria-label={`Vote for ${c.name}`}
                >●</button>
              </div>
            ))}
          </div>
          {chosen && (
            <div className="mt-2 rounded-lg bg-success/15 py-1 text-center text-[10px] font-bold text-success animate-scale-in">
              ✓ {txt.m3_s3_voted}
            </div>
          )}
        </div>

        {/* VVPAT */}
        <div className="w-40 rounded-2xl border-2 border-slate-300 bg-slate-800 p-3 shadow-lg">
          <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">VVPAT</div>
          <div className={`relative rounded-xl border-2 overflow-hidden transition-all duration-500 ${vvpatOpen ? "border-yellow-400 bg-yellow-50 h-32" : "border-slate-600 bg-slate-700 h-28"}`}>
            {vvpatOpen && candidate ? (
              <div className="flex flex-col items-center justify-center h-full p-2 animate-scale-in">
                <span className="text-4xl">{candidate.symbol}</span>
                <p className="mt-1 text-xs font-bold text-slate-800">{candidate.name}</p>
                <div className="mt-2 flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-0.5">
                  <span className="text-[10px] font-black text-yellow-900">{countdown}s</span>
                </div>
              </div>
            ) : vvpatDone ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Check className="h-6 w-6 text-success" />
                <p className="text-[9px] text-slate-400 mt-1">Slip deposited</p>
              </div>
            ) : (
              <p className="flex h-full items-center justify-center text-[9px] text-slate-500 text-center px-2">
                {chosen ? "Opening…" : "Window closes after voting"}
              </p>
            )}
          </div>
          <p className="mt-1 text-center text-[8px] text-slate-500">Paper slip visible for 7 sec</p>
        </div>
      </div>

      {vvpatDone && (
        <div className="animate-scale-in rounded-xl bg-blue-50 border border-blue-200 px-5 py-3 max-w-md w-full text-sm">
          <p className="font-bold text-blue-800">How it works:</p>
          <ul className="mt-1 space-y-0.5 text-xs text-blue-700">
            <li>• The <strong>EVM Ballot Unit</strong> records your vote electronically.</li>
            <li>• The <strong>VVPAT</strong> prints a paper slip you can visually verify.</li>
            <li>• The slip drops into a sealed box — only used for audits.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Recap ── */
function Recap3({ onComplete }: { onComplete: () => void }) {
  const txt = useModuleText();
  const ran = useRef(false);
  useEffect(() => { if (!ran.current) { ran.current = true; onComplete(); } }, [onComplete]);
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
        <PartyPopper className="h-10 w-10 text-success" />
      </div>
      <h4 className="text-2xl font-bold">{txt.m3_s4_title}</h4>
      <p className="max-w-md text-sm text-muted-foreground">
        {txt.m3_recap_desc}
      </p>
      <ElectronAvatar size={88} pose="celebrate" />
    </div>
  );
}
