import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, PartyPopper, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ElectronAvatar } from "@/components/ElectronAvatar";
import { useGuidedSteps, useGuidedTouch } from "@/components/guided-touch/GuidedTouch";
import { useProgress } from "@/hooks/useProgress";
import { useT } from "@/hooks/useT";
import { toast } from "@/hooks/use-toast";
import { VoicePanel } from "@/components/VoicePanel";
import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { useModuleText } from "@/lib/moduleTexts";

const MODULE_ID = 1 as const;

const STEPS = [
  { key: "scroll",      titleKey: "m1_s1_title" as const },
  { key: "nominations", titleKey: "m1_s2_title" as const },
  { key: "manifestos",  titleKey: "m1_s3_title" as const },
  { key: "conduct",     titleKey: "m1_s4_title" as const },
  { key: "recap",       titleKey: "m1_s5_title" as const },
];

export default function Module1() {
  const t = useT();
  const txt = useModuleText();
  const nav = useNavigate();
  const { state, updateStep } = useProgress();
  const [chat, setChat] = useState(false);
  const { enabled, toggle, replay } = useGuidedTouch();

  // Restore step completion from persisted state
  const savedSteps = state.modules[MODULE_ID].steps;
  const [done, setDone] = useState<boolean[]>(savedSteps.length === STEPS.length ? [...savedSteps] : Array(STEPS.length).fill(false));

  // Jump to the last incomplete step on mount
  const [step, setStep] = useState(() => {
    const last = savedSteps.lastIndexOf(true);
    return last === -1 ? 0 : Math.min(last + 1, STEPS.length - 1);
  });

  const markDone = (i: number) => {
    setDone(d => { if (d[i]) return d; const n = [...d]; n[i] = true; return n; });
    updateStep(MODULE_ID, i);
  };
  const wrong = () =>
    toast({ title: t("tryAgain"), description: "That wasn't quite right — try again." });

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
          {txt.m1_title}
        </h2>

        <div className="mt-3 grid grid-cols-12 gap-5">
          {/* Sidebar steps */}
          <aside className="col-span-12 rounded-2xl border bg-card p-4 shadow-card md:col-span-3">
            <h3 className="mb-3 text-sm font-semibold">Steps</h3>
            <ul className="space-y-1.5">
              {STEPS.map((s, i) => (
                <li key={s.key}>
                  <button
                    onClick={() => setStep(i)}
                    disabled={i > 0 && !done[i - 1]}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-all ${
                      i === step ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary"
                    } ${i > 0 && !done[i - 1] ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      done[i] ? "bg-success text-success-foreground" : "bg-secondary text-foreground"
                    }`}>
                      {done[i] ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    {txt[s.titleKey]}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main stage */}
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
              {step === 0 && <ScrollAnnounce onDone={() => { markDone(0); confetti({ particleCount: 80, spread: 70 }); }} />}
              {step === 1 && <Nominations onDone={() => markDone(1)} wrong={wrong} />}
              {step === 2 && <ManifestoSwipe onDone={() => markDone(2)} />}
              {step === 3 && <Conduct onDone={() => markDone(3)} wrong={wrong} />}
              {step === 4 && <Recap onComplete={() => { confetti({ particleCount: 150, spread: 100 }); markDone(4); }} />}
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <Button variant="ghost" size="sm" onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0}>
                <ChevronLeft className="h-4 w-4" /> {t("back")}
              </Button>
              <p className="text-xs text-muted-foreground">{t("guidedFooter")}</p>
              {step < STEPS.length - 1 ? (
                <Button size="sm" onClick={() => setStep(s => Math.min(s + 1, STEPS.length - 1))} disabled={!done[step]}>
                  {t("next")} <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="sm" onClick={() => nav("/dashboard")}>{t("finish")}</Button>
              )}
            </div>
          </section>
        </div>
      </main>

      <ChatSidebar open={chat} onClose={() => setChat(false)} moduleKey="module-1" contextLabel={txt[STEPS[step].titleKey]} />
      <VoicePanel moduleId={MODULE_ID} step={step} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 1.1 – The Official Announcement (Scroll)
───────────────────────────────────────────── */
function ScrollAnnounce({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const TIMELINE = [
    { date: "Day 0",    event: txt.m1_timeline_1_e,  desc: txt.m1_timeline_1_d },
    { date: "Day 1–7",  event: txt.m1_timeline_2_e,  desc: txt.m1_timeline_2_d },
    { date: "Day 8",    event: txt.m1_timeline_3_e,  desc: txt.m1_timeline_3_d },
    { date: "Day 9",    event: txt.m1_timeline_4_e,  desc: txt.m1_timeline_4_d },
    { date: "Day 14",   event: txt.m1_timeline_5_e,  desc: txt.m1_timeline_5_d },
    { date: "Day 28",   event: txt.m1_timeline_6_e,  desc: txt.m1_timeline_6_d },
  ];

  const [unrolled, setUnrolled] = useState(false);
  useGuidedSteps(
    [{ id: "scroll", targetId: "gt-scroll", hint: txt.m1_scroll_hint, gesture: "tap" }],
    unrolled ? null : "scroll"
  );

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="max-w-md text-sm text-muted-foreground">
        {txt.m1_scroll_desc}
      </p>

      <button
        data-gt-id="gt-scroll"
        onClick={() => { if (!unrolled) { setUnrolled(true); onDone(); } }}
        className={`relative w-full max-w-sm rounded-xl border-2 border-amber-300 bg-amber-50 shadow-lg text-left transition-all ${!unrolled ? "cursor-pointer hover:scale-105 hover:shadow-xl" : "cursor-default"}`}
        style={{ fontFamily: "Georgia, serif" }}
        aria-label="Unroll election schedule scroll"
      >
        <div className="h-5 rounded-t-xl bg-gradient-to-r from-amber-400 to-amber-300" />
        <div
          className="overflow-hidden transition-all duration-700"
          style={{ maxHeight: unrolled ? "500px" : "72px" }}
        >
          <div className="p-5">
            <div className="mb-3 text-center">
              <p className="text-lg font-bold text-amber-900">📜 {txt.m1_scroll_unroll}</p>
            </div>
            {!unrolled && <p className="text-sm text-amber-600 italic text-center">{txt.m1_scroll_hint}</p>}
            {unrolled && (
              <div className="space-y-2">
                {TIMELINE.map(item => (
                  <div key={item.date} className="flex gap-3 rounded-lg bg-amber-100/70 px-3 py-2">
                    <span className="w-14 shrink-0 text-xs font-bold text-amber-700">{item.date}</span>
                    <div>
                      <p className="text-xs font-bold text-amber-900">{item.event}</p>
                      <p className="text-[10px] text-amber-700">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="h-5 rounded-b-xl bg-gradient-to-r from-amber-400 to-amber-300" />
      </button>

      {unrolled && (
        <div className="animate-scale-in w-full max-w-sm rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-left">
          <p className="text-sm font-bold text-blue-800">📋 Model Code of Conduct (MCC)</p>
          <p className="mt-1 text-xs text-blue-700">
            The MCC is a set of ECI guidelines that regulate parties and candidates from the announcement
            date until results are declared. It prevents misuse of government resources for campaigning.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Step 1.2 – Candidate Nominations (DnD)
───────────────────────────────────────── */
function Nominations({ onDone, wrong }: { onDone: () => void; wrong: () => void }) {
  const txt = useModuleText();
  const NOM_ITEMS = [
    { id: "n1", label: "📸 Photo ID",          slot: "id_slot" },
    { id: "n2", label: "✍️ Signed Form",       slot: "sig_slot" },
    { id: "n3", label: "💰 Deposit ₹25,000",   slot: "dep_slot" },
  ];
  const NOM_SLOTS = [
    { id: "id_slot",  label: "Candidate Photo" },
    { id: "sig_slot", label: "Signed Nomination Form" },
    { id: "dep_slot", label: txt.m1_nom_deposit },
  ];

  const [placed, setPlaced] = useState<Record<string, string>>({});
  const remaining = NOM_ITEMS.filter(item => !placed[item.id]);
  const allDone = Object.keys(placed).length === NOM_ITEMS.length;

  useGuidedSteps(
    remaining.length
      ? [{ id: "drag-nom", targetId: `gt-nom-${remaining[0].id}`, hint: txt.m1_nom_desc, gesture: "drag" }]
      : [],
    remaining.length ? "drag-nom" : null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const id = String(e.active.id);
    const over = e.over?.id ? String(e.over.id) : null;
    if (!over) return;
    const item = NOM_ITEMS.find(i => i.id === id);
    if (!item) return;
    if (item.slot !== over) { wrong(); return; }
    setPlaced(p => {
      const np = { ...p, [id]: over };
      if (Object.keys(np).length === NOM_ITEMS.length) onDone();
      return np;
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <p className="mb-4 text-sm text-muted-foreground">
        Help the candidate file their nomination. Drag each document into the correct slot on the form.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Documents</p>
          <div className="space-y-2 min-h-[100px]">
            {remaining.map(item => <NomDraggable key={item.id} id={item.id} label={item.label} />)}
            {remaining.length === 0 && <p className="text-xs italic text-muted-foreground">All placed!</p>}
          </div>
        </div>
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="mb-3 text-center text-xs font-bold uppercase text-slate-500">Nomination Form</p>
          <div className="space-y-2">
            {NOM_SLOTS.map(slot => (
              <NomDropSlot key={slot.id} id={slot.id} label={slot.label}
                placedItem={NOM_ITEMS.find(i => placed[i.id] === slot.id)} />
            ))}
          </div>
        </div>
      </div>
      {allDone && (
        <div className="mt-4 animate-scale-in rounded-xl bg-success/15 px-4 py-3">
          <p className="text-sm font-bold text-success">✅ Nomination filed successfully!</p>
          <p className="mt-1 text-xs text-success/80">
            <strong>Eligibility:</strong> Age 25+, Indian citizen, registered voter, not barred by law.
            The Returning Officer scrutinises papers the following day.
          </p>
        </div>
      )}
    </DndContext>
  );
}

function NomDraggable({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, touchAction: "none" } : { touchAction: "none" as const };
  return (
    <div ref={setNodeRef} data-gt-id={`gt-nom-${id}`} style={style} {...listeners} {...attributes}
      className={`cursor-grab select-none rounded-xl border bg-card px-4 py-3 text-sm font-semibold shadow-sm transition-shadow transition-opacity ${isDragging ? "opacity-50 scale-105" : "hover:shadow-md"}`}>
      {label}
    </div>
  );
}

function NomDropSlot({ id, label, placedItem }: { id: string; label: string; placedItem?: { id: string; label: string } }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef}
      className={`min-h-[44px] rounded-lg border-2 border-dashed px-3 py-2 text-sm transition
        ${isOver ? "border-primary bg-primary/5" : "border-slate-300"}
        ${placedItem ? "border-success bg-success/10" : ""}`}>
      {placedItem
        ? <span className="font-semibold text-success">{placedItem.label} ✓</span>
        : <span className="text-xs text-slate-400">{label}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────
   Step 1.3 – Campaigning & Manifestos (Swipe)
───────────────────────────────────────── */
const MANIFESTO_TOPICS = [
  {
    topic: "📚 Education",
    ideology: "Ensuring equal opportunity for every child regardless of background.",
    promise: "Free textbooks, uniforms & mid-day meals for all government school students.",
    party: "Progressive Alliance",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    topic: "🏥 Health",
    ideology: "Healthcare is a fundamental right, not a privilege.",
    promise: "₹5 lakh health insurance cover for all families below the poverty line.",
    party: "People's Front",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  {
    topic: "🏗️ Infrastructure",
    ideology: "Strong connectivity drives economic growth for all citizens.",
    promise: "Build 10,000 km of village roads and 50 new railway stations in 5 years.",
    party: "National Dev Party",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
  },
];

function ManifestoSwipe({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const [idx, setIdx] = useState(0);
  const [viewed, setViewed] = useState<Set<number>>(new Set([0]));
  const allViewed = viewed.size === MANIFESTO_TOPICS.length;

  useGuidedSteps(
    [{ id: "swipe-mani", targetId: "gt-mani-next", hint: txt.m1_man_desc, gesture: "swipe" }],
    idx < MANIFESTO_TOPICS.length - 1 ? "swipe-mani" : null
  );

  const goNext = () => {
    const n = Math.min(idx + 1, MANIFESTO_TOPICS.length - 1);
    setIdx(n);
    setViewed(v => new Set([...v, n]));
  };

  const card = MANIFESTO_TOPICS[idx];

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">
        {txt.m1_man_desc}
      </p>
      <div className={`w-full max-w-md rounded-2xl border-2 ${card.color} p-6 shadow-card animate-scale-in`}>
        <div className="mb-3 flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${card.badge}`}>{card.party}</span>
          <span className="text-2xl">{card.topic.split(" ")[0]}</span>
        </div>
        <h4 className="mb-4 text-lg font-bold">{card.topic}</h4>
        <div className="mb-3 rounded-xl bg-white/60 p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">💡 Core Ideology</p>
          <p className="text-sm text-slate-700">{card.ideology}</p>
        </div>
        <div className="rounded-xl bg-white/60 p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">📋 Specific Promise</p>
          <p className="text-sm font-semibold text-slate-800">{card.promise}</p>
        </div>
      </div>
      <div className="flex gap-1.5">
        {MANIFESTO_TOPICS.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === idx ? "w-5 bg-primary" : viewed.has(i) ? "w-2 bg-primary/40" : "w-2 bg-secondary"}`} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setIdx(i => Math.max(i - 1, 0))} disabled={idx === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {idx < MANIFESTO_TOPICS.length - 1
          ? <Button data-gt-id="gt-mani-next" size="sm" onClick={goNext}>Next Topic <ArrowRight className="ml-1 h-4 w-4" /></Button>
          : <Button size="sm" onClick={onDone} disabled={!allViewed} variant={allViewed ? "default" : "secondary"}>
              {allViewed ? "✅ Done!" : "Read all topics first"}
            </Button>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Step 1.4 – Code of Conduct (DnD) — kept
───────────────────────────────────────── */
const ACTIONS = [
  { id: "a1", label: "Door-to-door campaigning", legal: true },
  { id: "a2", label: "Bribing voters with cash", legal: false },
  { id: "a3", label: "Publishing a manifesto", legal: true },
  { id: "a4", label: "Hate speech in a rally", legal: false },
  { id: "a5", label: "Using public funds for ads", legal: false },
  { id: "a6", label: "Holding peaceful debates", legal: true },
];

function Conduct({ onDone, wrong }: { onDone: () => void; wrong: () => void }) {
  const txt = useModuleText();
  const [placed, setPlaced] = useState<Record<string, "legal" | "illegal" | null>>({});
  const remaining = ACTIONS.filter(a => !placed[a.id]);

  useGuidedSteps(
    remaining.length ? [{ id: "drag", targetId: `gt-card-${remaining[0].id}`, hint: txt.m1_mcc_desc, gesture: "drag" }] : [],
    remaining.length ? "drag" : null
  );

  const onDragEnd = (e: DragEndEvent) => {
    const id = String(e.active.id);
    const over = e.over?.id ? String(e.over.id) : null;
    if (!over) return;
    const action = ACTIONS.find(a => a.id === id);
    if (!action) return;
    const correct = (over === "legal" && action.legal) || (over === "illegal" && !action.legal);
    if (!correct) { wrong(); return; }
    setPlaced(p => {
      const np = { ...p, [id]: over as "legal" | "illegal" };
      if (Object.keys(np).length === ACTIONS.length) onDone();
      return np;
    });
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <p className="mb-3 text-sm text-muted-foreground">{txt.m1_mcc_desc}</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          {ACTIONS.filter(a => !placed[a.id]).map(a => <DraggableCard key={a.id} id={a.id} label={a.label} />)}
          {!remaining.length && <p className="text-sm font-semibold text-success">All sorted!</p>}
        </div>
        <DropZone id="legal"   label={`✅ ${txt.m1_mcc_yes}`}   tone="bg-success/10 border-success/40"     items={ACTIONS.filter(a => placed[a.id] === "legal")} />
        <DropZone id="illegal" label={`❌ ${txt.m1_mcc_no}`} tone="bg-destructive/10 border-destructive/40" items={ACTIONS.filter(a => placed[a.id] === "illegal")} />
      </div>
    </DndContext>
  );
}

function DraggableCard({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, touchAction: "none" } : { touchAction: "none" as const };
  return (
    <div ref={setNodeRef} data-gt-id={`gt-card-${id}`} style={style} {...listeners} {...attributes}
      className={`cursor-grab select-none rounded-xl border bg-card px-3 py-2 text-sm shadow-sm transition-opacity ${isDragging ? "opacity-50 scale-105" : "hover:shadow-md"}`}>
      {label}
    </div>
  );
}

function DropZone({ id, label, tone, items }: { id: string; label: string; tone: string; items: { id: string; label: string }[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`rounded-2xl border-2 border-dashed p-3 ${tone} ${isOver ? "ring-2 ring-primary" : ""}`}>
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <div className="space-y-1.5">
        {items.map(i => <div key={i.id} className="rounded-lg bg-card px-2.5 py-1.5 text-xs">{i.label}</div>)}
        {!items.length && <p className="text-xs text-muted-foreground">Drop cards here</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   Step 1.5 – Recap
───────────────────────────────────── */
function Recap({ onComplete }: { onComplete: () => void }) {
  const txt = useModuleText();
  const ran = useRef(false);
  useEffect(() => { if (!ran.current) { ran.current = true; onComplete(); } }, [onComplete]);
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
        <PartyPopper className="h-10 w-10 text-success" />
      </div>
      <h4 className="text-2xl font-bold">{txt.m1_s5_title}</h4>
      <p className="max-w-md text-sm text-muted-foreground">
        {txt.m1_recap_desc}
      </p>
      <ElectronAvatar size={88} pose="celebrate" />
    </div>
  );
}