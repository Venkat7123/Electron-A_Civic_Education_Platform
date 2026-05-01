import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, PartyPopper, RefreshCw, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ElectronAvatar } from "@/components/ElectronAvatar";
import { useGuidedSteps, useGuidedTouch } from "@/components/guided-touch/GuidedTouch";
import { useProgress } from "@/hooks/useProgress";
import { useT } from "@/hooks/useT";
import { VoicePanel } from "@/components/VoicePanel";
import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { useModuleText } from "@/lib/moduleTexts";

const MODULE_ID = 4 as const;

const STEPS = [
  { key: "seal",     titleKey: "m4_s1_title" as const },
  { key: "counting", titleKey: "m4_s2_title" as const },
  { key: "vvpat",   titleKey: "m4_s3_title" as const },
  { key: "winner",  titleKey: "m4_s4_title" as const },
  { key: "recap",   titleKey: "m4_s5_title" as const },
];

export default function Module4() {
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
          {txt.m4_title}
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
                  <div key={i} className={`h-1.5 w-8 rounded-full ${i <= step ? "bg-success" : "bg-secondary"}`} />
                ))}
              </div>
            </div>

            <div key={step} className="animate-fade-in">
              {step === 0 && <SealStep    onDone={() => markDone(0)} />}
              {step === 1 && <CountStep   onDone={() => markDone(1)} />}
              {step === 2 && <VvpatAudit  onDone={() => markDone(2)} />}
              {step === 3 && <WinnerStep  onDone={() => { confetti({ particleCount: 200, spread: 120 }); markDone(3); }} />}
              {step === 4 && <Recap4 onComplete={() => { confetti({ particleCount: 200, spread: 140, origin: { y: 0.4 } }); markDone(4); }} />}
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
                : <Button size="sm" onClick={() => nav("/certificate")}>{t("finish")} 🎓</Button>}
            </div>
          </section>
        </div>
      </main>
      <ChatSidebar open={chat} onClose={() => setChat(false)} moduleKey="module-4" contextLabel={txt[STEPS[step].titleKey]} />
      <VoicePanel moduleId={MODULE_ID} step={step} />
    </div>
  );
}

/* ── Step 4.1 Sealing & Strong Room ── */
function SealStep({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const [sealTapped, setSealTapped] = useState(false);
  const [waxTapped, setWaxTapped] = useState(false);
  const [inRoom, setInRoom] = useState(false);

  useGuidedSteps(
    !sealTapped
      ? [{ id: "s1", targetId: "gt-seal", hint: txt.m4_s1_tap_seal, gesture: "tap" }]
      : !waxTapped
      ? [{ id: "s2", targetId: "gt-wax", hint: txt.m4_s1_tap_wax, gesture: "tap" }]
      : !inRoom
      ? [{ id: "s3", targetId: "gt-evm-drag", hint: txt.m4_s1_drag, gesture: "drag" }]
      : [],
    !sealTapped ? "s1" : !waxTapped ? "s2" : !inRoom ? "s3" : null
  );

  const onDragEnd = (e: DragEndEvent) => {
    if (e.over?.id === "strongroom" && sealTapped && waxTapped) {
      setInRoom(true);
      onDone();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <p className="mb-4 text-sm text-muted-foreground">
        {txt.m4_s1_desc}
      </p>

      {/* Progress steps */}
      <div className="mb-5 flex items-center gap-2">
        {[
          { label: txt.m4_s1_tap_seal, done: sealTapped },
          { label: txt.m4_s1_tap_wax, done: waxTapped },
          { label: txt.m4_s1_drag, done: inRoom },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition ${s.done ? "bg-success text-white" : "bg-secondary text-muted-foreground"}`}>
              {s.done ? "✓" : i + 1}
            </div>
            <span className={`text-xs ${s.done ? "text-success font-semibold" : "text-muted-foreground"}`}>{s.label}</span>
            {i < 2 && <span className="text-slate-300 mx-1">→</span>}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 items-start justify-center">
        {/* Items to tap */}
        <div className="flex flex-col gap-3">
          <button data-gt-id="gt-seal" onClick={() => setSealTapped(true)} disabled={sealTapped}
            className={`rounded-xl border-2 px-5 py-4 text-center transition ${sealTapped ? "border-success bg-success/10 opacity-70" : "border-slate-300 bg-card hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer"}`}>
            <div className="text-3xl">🏷️</div>
            <p className="mt-1 text-xs font-semibold">{sealTapped ? "Seal Applied ✓" : "Paper Seal"}</p>
          </button>
          <button data-gt-id="gt-wax" onClick={() => waxTapped || !sealTapped ? null : setWaxTapped(true)}
            disabled={waxTapped || !sealTapped}
            className={`rounded-xl border-2 px-5 py-4 text-center transition ${waxTapped ? "border-success bg-success/10 opacity-70" : !sealTapped ? "border-slate-200 bg-slate-50 opacity-40 cursor-not-allowed" : "border-amber-300 bg-amber-50 hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer"}`}>
            <div className="text-3xl">🕯️</div>
            <p className="mt-1 text-xs font-semibold">{waxTapped ? "Wax Applied ✓" : "Wax Thread"}</p>
          </button>
        </div>

        {/* Draggable EVM */}
        {/* Draggable EVM */}
        {!inRoom && sealTapped && waxTapped && <EvmDraggable />}

        {/* Strong Room drop zone */}
        {/* Strong Room drop zone */}
        <StrongRoomDroppable inRoom={inRoom} />
      </div>

      {inRoom && (
        <div className="mt-4 animate-scale-in rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-100">
          <p className="font-bold">🔐 Security Protocols:</p>
          <ul className="mt-1 space-y-0.5 text-xs text-slate-300">
            <li>• Armed police guards stationed 24/7 outside</li>
            <li>• CCTV cameras with continuous recording</li>
            <li>• Candidate agents allowed to camp outside the room</li>
          </ul>
        </div>
      )}
    </DndContext>
  );
}

function EvmDraggable() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: "evm-unit" });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, touchAction: "none" } : { touchAction: "none" as const };
  return (
    <div ref={setNodeRef} data-gt-id="gt-evm-drag" style={style} {...listeners} {...attributes}
      className="cursor-grab rounded-2xl border-2 border-success bg-success/10 px-6 py-5 shadow-lg text-center animate-scale-in">
      <div className="text-4xl">🖥️</div>
      <p className="mt-1 text-xs font-bold text-success">Sealed EVM</p>
      <p className="text-[9px] text-success/70">Drag to Strong Room →</p>
    </div>
  );
}

function StrongRoomDroppable({ inRoom }: { inRoom: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: "strongroom" });
  return (
    <div ref={setNodeRef}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition min-w-[140px] min-h-[120px]
        ${inRoom ? "border-success bg-success/10" : isOver ? "border-primary bg-primary/5" : "border-slate-300 bg-slate-50"}`}>
      {inRoom ? (
        <>
          <div className="text-3xl">🔒</div>
          <p className="mt-1 text-xs font-bold text-success text-center">Strong Room<br/>Secured ✓</p>
          <div className="mt-1 flex gap-1 text-sm">🛡️ 📷</div>
        </>
      ) : (
        <>
          <div className="text-3xl opacity-40">🏛️</div>
          <p className="mt-1 text-xs text-slate-400 text-center">Strong Room<br/>(Drop EVM here)</p>
        </>
      )}
    </div>
  );
}

/* ── Step 4.2 Counting Day ── */
const COUNT_CANDIDATES = [
  { id: "A", name: "Vijay",       symbol: "🥳", color: "bg-yellow-400",    maxVotes: 85000 },
  { id: "B", name: "Stalin",      symbol: "☀️", color: "bg-red-500", maxVotes: 62000 },
  { id: "C", name: "Palaniswami", symbol: "🍀", color: "bg-green-600",  maxVotes: 41000 },
];

function CountStep({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const [counting, setCounting] = useState(false);
  const [round, setRound] = useState(0);
  const [votes, setVotes] = useState([0, 0, 0]);
  const TOTAL_ROUNDS = 14;
  const done = round >= TOTAL_ROUNDS;

  useGuidedSteps(
    [{ id: "result-btn", targetId: "gt-result-btn", hint: txt.m4_s2_desc, gesture: "tap" }],
    counting ? null : "result-btn"
  );

  useEffect(() => {
    if (!counting || done) return;
    const iv = setInterval(() => {
      setRound(r => {
        const next = r + 1;
        setVotes(COUNT_CANDIDATES.map(c => Math.round((next / TOTAL_ROUNDS) * c.maxVotes * (0.9 + Math.random() * 0.2))));
        if (next >= TOTAL_ROUNDS) { clearInterval(iv); onDone(); }
        return next;
      });
    }, 100);
    return () => clearInterval(iv);
  }, [counting, done, onDone]);

  const maxV = Math.max(...votes, 1);
  const leader = votes.indexOf(Math.max(...votes));

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        {txt.m4_s2_desc}
      </p>

      {/* Control Unit */}
      <div className="mx-auto w-48 rounded-2xl border-2 border-slate-400 bg-slate-800 p-4 shadow-lg text-center">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Control Unit</p>
        <div className="mb-3 rounded-lg bg-slate-900 px-2 py-1.5">
          <p className="text-xs font-mono text-green-400">
            {counting ? `Round ${round}/${TOTAL_ROUNDS}` : "READY"}
          </p>
        </div>
        <button data-gt-id="gt-result-btn" onClick={() => !counting && setCounting(true)} disabled={counting}
          className={`w-full rounded-xl py-3 text-sm font-black tracking-wide transition ${counting ? "bg-slate-600 text-slate-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"}`}>
          {done ? "✓ COUNTED" : "RESULT"}
        </button>
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">
            {done ? "Final Count" : counting ? `Round ${round} of ${TOTAL_ROUNDS}` : "Awaiting count…"}
          </p>
          {done && <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-bold text-success">Count Complete</span>}
        </div>
        <div className="space-y-3">
          {COUNT_CANDIDATES.map((c, i) => (
            <div key={c.id} className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${done && i === leader ? "bg-success/10 ring-1 ring-success" : ""}`}>
              <span className="text-lg w-7">{c.symbol}</span>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-semibold">{c.name}</p>
                  <p className="text-xs font-mono text-muted-foreground">{votes[i].toLocaleString()}</p>
                </div>
                <div className="h-5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${c.color} transition-all duration-500`}
                    style={{ width: `${maxV > 0 ? (votes[i] / maxV) * 100 : 0}%` }} />
                </div>
              </div>
              {done && i === leader && <span className="text-sm">👑</span>}
            </div>
          ))}
        </div>
      </div>

      {done && (
        <div className="animate-scale-in rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm">
          <p className="font-bold text-blue-800">Returning Officer's Role:</p>
          <p className="mt-1 text-xs text-blue-700">The RO supervises all counting staff, resolves disputes on doubtful votes, and officially announces the result once all rounds are tallied.</p>
        </div>
      )}
    </div>
  );
}

/* ── Step 4.3 VVPAT Audit ── */
const VVPAT_COUNTS = [18, 22, 15, 30, 25, 20, 17, 28, 12, 24];

function VvpatAudit({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [matched, setMatched] = useState(false);
  const TARGET = 5;

  useGuidedSteps(
    [{ id: "vvpat-box", targetId: "gt-vvpat-0", hint: txt.m4_s3_desc, gesture: "tap" }],
    matched ? null : "vvpat-box"
  );

  const toggle = (i: number) => {
    if (matched) return;
    setSelected(s => {
      const ns = new Set(s);
      if (ns.has(i)) { ns.delete(i); return ns; }
      if (ns.size < TARGET) { ns.add(i); if (ns.size === TARGET) { setTimeout(() => { setMatched(true); onDone(); }, 600); } return ns; }
      return s;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {txt.m4_s3_desc}
      </p>

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Select {TARGET} VVPAT boxes to audit:</p>
        <span className={`rounded-full px-3 py-0.5 text-xs font-black ${selected.size === TARGET ? "bg-success text-white" : "bg-secondary text-foreground"}`}>
          {selected.size}/{TARGET} selected
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {VVPAT_COUNTS.map((count, i) => {
          const sel = selected.has(i);
          return (
            <button key={i} data-gt-id={i === 0 ? "gt-vvpat-0" : undefined}
              onClick={() => toggle(i)} disabled={matched}
              className={`relative rounded-xl border-2 p-3 text-center transition hover:scale-105 active:scale-95
                ${sel ? "border-success bg-success/10 shadow-md" : "border-slate-200 bg-card hover:border-primary/40"}`}>
              <div className={`text-lg mb-0.5 ${sel ? "" : "opacity-30"}`}>📋</div>
              {sel ? (
                <div className="animate-scale-in">
                  <p className="text-[10px] font-bold text-success">{count} slips</p>
                  <p className="text-[8px] text-success/70">Matched ✓</p>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400">Box {i + 1}</p>
              )}
            </button>
          );
        })}
      </div>

      {matched && (
        <div className="animate-scale-in rounded-xl bg-success/15 border border-success/30 px-5 py-3 text-sm">
          <p className="font-bold text-success">✅ All {TARGET} VVPAT boxes verified — counts match perfectly!</p>
          <p className="mt-1 text-xs text-success/80">
            By law, 5 EVMs per assembly constituency are mandatorily verified. A match confirms the electronic count is accurate and trustworthy.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Step 4.4 Winner Declaration ── */
function WinnerStep({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const [dropped, setDropped] = useState(false);

  useGuidedSteps(
    [{ id: "cert-drag", targetId: "gt-certificate", hint: txt.m4_s4_desc, gesture: "drag" }],
    dropped ? null : "cert-drag"
  );

  const onDragEnd = (e: DragEndEvent) => {
    if (e.over?.id === "winner-hand") { setDropped(true); onDone(); }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <p className="mb-4 text-sm text-muted-foreground text-center">
        {txt.m4_s4_desc}
      </p>

      <div className="flex items-center justify-around gap-6">
        {/* RO with certificate */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl">👨‍⚖️</div>
          <p className="text-xs font-semibold text-center">Returning<br/>Officer</p>
          {!dropped && <CertDraggable />}
        </div>

        {/* Arrow */}
        <div className="text-2xl text-slate-300">→</div>

        {/* Winner drop zone */}
        {/* Winner drop zone */}
        <WinnerDroppable dropped={dropped} />
      </div>

      {dropped && (
        <div className="mt-5 animate-scale-in rounded-2xl bg-gradient-to-r from-orange-50 to-blue-50 border border-slate-200 px-5 py-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <p className="font-bold text-slate-800">Democracy Has Spoken!</p>
          </div>
          <p className="text-xs text-slate-700">
            The elected representative will now join the <strong>Lok Sabha / State Legislature</strong> to represent their constituency. The winning party (or coalition) that secures a majority forms the government and elects the Prime Minister / Chief Minister.
          </p>
        </div>
      )}
    </DndContext>
  );
}

function CertDraggable() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: "certificate" });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, touchAction: "none" } : { touchAction: "none" as const };
  return (
    <div ref={setNodeRef} data-gt-id="gt-certificate" style={style} {...listeners} {...attributes}
      className="cursor-grab rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3 shadow-lg text-center hover:shadow-xl active:scale-95 transition">
      <p className="text-2xl">📜</p>
      <p className="text-[10px] font-bold text-amber-800">Certificate<br/>of Election</p>
    </div>
  );
}

function WinnerDroppable({ dropped }: { dropped: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: "winner-hand" });
  return (
    <div ref={setNodeRef} className="flex flex-col items-center gap-2">
      <div className="text-4xl">{dropped ? "🎉" : "🧑‍💼"}</div>
      <p className="text-xs font-semibold text-center">{dropped ? "Vijay\nElected as CM!" : "Winning\nCandidate"}</p>
      <div className={`min-h-[80px] w-32 rounded-xl border-2 border-dashed flex items-center justify-center transition
        ${dropped ? "border-success bg-success/10" : isOver ? "border-primary bg-primary/5 scale-105" : "border-slate-300 bg-slate-50"}`}>
        {dropped
          ? <div className="text-center animate-scale-in"><p className="text-2xl">📜</p><p className="text-[10px] font-bold text-success">Received! ✓</p></div>
          : <p className="text-xs text-slate-400 text-center px-2">{isOver ? "Release to hand over!" : "Drop certificate here"}</p>}
      </div>
    </div>
  );
}

/* ── Final Recap ── */
function Recap4({ onComplete }: { onComplete: () => void }) {
  const txt = useModuleText();
  const ran = useRef(false);
  useEffect(() => { if (!ran.current) { ran.current = true; onComplete(); } }, [onComplete]);
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 ring-4 ring-amber-300">
        <Trophy className="h-12 w-12 text-amber-500" />
      </div>
      <h4 className="text-2xl font-bold">{txt.m4_s5_title}</h4>
      <p className="max-w-md text-sm text-muted-foreground">
        {txt.m4_recap_desc}
      </p>
      <ElectronAvatar size={88} pose="celebrate" />
      <Link to="/certificate" className="mt-2 flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
        <Trophy className="h-4 w-4" /> Claim your Certificate of Civic Education
      </Link>
    </div>
  );
}
