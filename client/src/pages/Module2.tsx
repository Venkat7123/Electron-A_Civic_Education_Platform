import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, MapPin, PartyPopper, RefreshCw, Search } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { useModuleText } from "@/lib/moduleTexts";

const MODULE_ID = 2 as const;

const STEPS = [
  { key: "form6", titleKey: "m2_s1_title" as const },
  { key: "form8", titleKey: "m2_s2_title" as const },
  { key: "sir",   titleKey: "m2_s3_title" as const },
  { key: "booth", titleKey: "m2_s4_title" as const },
  { key: "recap", titleKey: "m2_s5_title" as const },
];

export default function Module2() {
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
  const wrong = () => toast({ title: t("tryAgain"), description: "That wasn't quite right — try again." });

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
          {txt.m2_title}
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
              {step === 0 && <Form6Step onDone={() => markDone(0)} wrong={wrong} />}
              {step === 1 && <Form8Step onDone={() => markDone(1)} />}
              {step === 2 && <SIRStep  onDone={() => markDone(2)} />}
              {step === 3 && <BoothFinder onDone={() => markDone(3)} />}
              {step === 4 && <Recap2 onComplete={() => { confetti({ particleCount: 150, spread: 100 }); markDone(4); }} />}
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
      <ChatSidebar open={chat} onClose={() => setChat(false)} moduleKey="module-2" contextLabel={txt[STEPS[step].titleKey]} />
      <VoicePanel moduleId={MODULE_ID} step={step} />
    </div>
  );
}

/* ── Step 2.1 Form 6 DnD ── */
const DOCS = [
  { id: "d1", label: "🖼️ Photo",        slot: "s1" },
  { id: "d2", label: "📅 Age Proof",     slot: "s2" },
  { id: "d3", label: "🏠 Address Proof", slot: "s3" },
];
const SLOTS = [
  { id: "s1", label: "Attach Photo" },
  { id: "s2", label: "Attach Age Proof" },
  { id: "s3", label: "Attach Address Proof" },
];

function Form6Step({ onDone, wrong }: { onDone: () => void; wrong: () => void }) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const remaining = DOCS.filter(d => !placed[d.id]);
  const allDone = Object.keys(placed).length === DOCS.length;

  useGuidedSteps(
    remaining.length ? [{ id: "f6drag", targetId: `gt-doc-${remaining[0].id}`, hint: "Drag the document into the Form 6 slot", gesture: "drag" }] : [],
    remaining.length ? "f6drag" : null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const id = String(e.active.id);
    const over = e.over?.id ? String(e.over.id) : null;
    if (!over) return;
    const doc = DOCS.find(d => d.id === id);
    if (!doc || doc.slot !== over) { wrong(); return; }
    setPlaced(p => {
      const np = { ...p, [id]: over };
      if (Object.keys(np).length === DOCS.length) onDone();
      return np;
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <p className="mb-4 text-sm text-muted-foreground">
        Turning 18? Register to vote! Drag your documents into the correct Form 6 slots.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your Documents</p>
          {remaining.map(d => (
            <Form6Draggable key={d.id} id={d.id} label={d.label} />
          ))}
          {!remaining.length && <p className="text-xs italic text-muted-foreground">All attached!</p>}
        </div>
        <div className="rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 p-4">
          <p className="mb-3 text-center text-xs font-bold uppercase text-indigo-600">Form 6 — New Voter Registration</p>
          <div className="space-y-2">
            {SLOTS.map(slot => (
              <Form6Droppable key={slot.id} id={slot.id} label={slot.label} placedItem={DOCS.find(d => placed[d.id] === slot.id)} />
            ))}
          </div>
        </div>
      </div>
      {allDone && (
        <div className="mt-4 animate-scale-in rounded-xl bg-success/15 px-4 py-3">
          <p className="text-sm font-bold text-success">✅ Form 6 submitted to NVSP!</p>
          <p className="mt-1 text-xs text-success/80">
            You can also register via the <strong>Voter Helpline App</strong> or at your local BLO office. Verification takes ~30 days.
          </p>
        </div>
      )}
    </DndContext>
  );
}

function Form6Draggable({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, touchAction: "none" } : { touchAction: "none" as const };
  return (
    <div ref={setNodeRef} data-gt-id={`gt-doc-${id}`} style={style} {...listeners} {...attributes}
      className={`cursor-grab select-none rounded-xl border bg-card px-4 py-3 text-sm font-semibold shadow-sm transition ${isDragging ? "opacity-50 scale-105" : "hover:shadow-md"}`}>
      {label}
    </div>
  );
}

function Form6Droppable({ id, label, placedItem }: { id: string; label: string; placedItem?: { id: string; label: string } }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef}
      className={`min-h-[44px] rounded-lg border-2 border-dashed px-3 py-2 text-sm transition
        ${isOver ? "border-primary bg-primary/5" : "border-indigo-300"}
        ${placedItem ? "border-success bg-success/10" : ""}`}>
      {placedItem ? <span className="font-semibold text-success">{placedItem.label} ✓</span>
            : <span className="text-xs text-indigo-400">{label}</span>}
    </div>
  );
}

/* ── Step 2.2 Form 8 Inline Edit ── */
function Form8Step({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("Rjesh Kumar");
  const [corrected, setCorrected] = useState(false);

  useGuidedSteps(
    [{ id: "f8tap", targetId: "gt-name-field", hint: txt.m2_f8_desc, gesture: "tap" }],
    corrected ? null : "f8tap"
  );

  const handleSubmit = () => {
    if (value.trim().toLowerCase() === "rajesh kumar") {
      setCorrected(true);
      setEditing(false);
      onDone();
    } else {
      toast({ title: "Not quite!", description: "The correct name is 'Rajesh Kumar'." });
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {txt.m2_f8_desc}
      </p>

      {/* Voter ID card */}
      <div className={`w-full max-w-sm rounded-2xl border-2 p-5 shadow-lg transition-all duration-500 ${corrected ? "border-success bg-success/5" : "border-slate-300 bg-gradient-to-br from-orange-50 to-orange-100"}`}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-800">Election Commission of India</p>
            <p className="text-xs text-orange-700">Electors Photo Identity Card</p>
          </div>
          <div className="text-2xl">🪪</div>
        </div>
        <div className="flex gap-4">
          <div className="h-16 w-14 rounded-lg bg-orange-200 flex items-center justify-center text-3xl">👤</div>
          <div className="flex-1 space-y-1">
            <div>
              <p className="text-[9px] font-bold uppercase text-orange-600">Name</p>
              {corrected ? (
                <p className="text-sm font-bold text-green-700 animate-scale-in">Rajesh Kumar ✓</p>
              ) : editing ? (
                <div className="flex gap-1">
                  <input autoFocus value={value} onChange={e => setValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    className="flex-1 rounded border border-primary px-2 py-0.5 text-sm outline-none ring-1 ring-primary" />
                  <Button size="sm" className="h-7 text-xs" onClick={handleSubmit}>Save</Button>
                </div>
              ) : (
                <button data-gt-id="gt-name-field" onClick={() => setEditing(true)}
                  className="group flex items-center gap-1 text-sm font-bold text-red-600 underline underline-offset-2 hover:text-red-800">
                  {value}
                  <span className="text-[9px] text-red-400 group-hover:text-red-600">✎ tap to edit</span>
                </button>
              )}
            </div>
            <p className="text-xs text-orange-700">EPIC: ABC1234567</p>
            <p className="text-xs text-orange-700">Part No: 042</p>
          </div>
        </div>
      </div>

      {corrected && (
        <div className="animate-scale-in rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm max-w-sm w-full">
          <p className="font-bold text-blue-800">Form 8 also handles:</p>
          <ul className="mt-1 space-y-0.5 text-xs text-blue-700">
            <li>• {txt.m2_f8_o1}</li>
            <li>• {txt.m2_f8_o2}</li>
            <li>• {txt.m2_f8_o3}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Step 2.3 SIR / BLO Verification ── */
const FAMILY = [
  { id: "f1", name: "Meena Devi", age: 45, eligible: true },
  { id: "f2", name: "Arjun Kumar", age: 16, eligible: false, reason: "Below 18" },
  { id: "f3", name: "Sundar Rajan", age: 34, eligible: true },
  { id: "f4", name: "Priya S.", age: 22, eligible: true },
];

function SIRStep({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const [decisions, setDecisions] = useState<Record<string, boolean | null>>({});
  const pending = FAMILY.find(f => decisions[f.id] === undefined);
  const allDone = Object.keys(decisions).length === FAMILY.length;
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);

  useGuidedSteps(
    pending ? [{ id: "blo", targetId: `gt-blo-${pending.id}`, hint: txt.m2_sir_verify, gesture: "tap" }] : [],
    pending ? "blo" : null
  );

  useEffect(() => { if (allDone) onDone(); }, [allDone, onDone]);

  const decide = (id: string, approved: boolean) => {
    const member = FAMILY.find(f => f.id === id);
    if (!member) return;
    const correct = approved === member.eligible;
    if (!correct) {
      setWrongAnswer(member.reason ? `${member.name} is ineligible: ${member.reason}` : "This person is not eligible.");
      setTimeout(() => setWrongAnswer(null), 2000);
      return;
    }
    setDecisions(d => ({ ...d, [id]: approved }));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {txt.m2_sir_desc}
      </p>

      {/* BLO scene */}
      <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <span className="text-3xl">👮</span>
        <div>
          <p className="text-sm font-bold text-amber-900">BLO Officer</p>
          <p className="text-xs text-amber-700">
            {allDone ? "Verification complete! Thank you." : "Please confirm your household members."}
          </p>
        </div>
        <div className="ml-auto text-3xl">📋</div>
      </div>

      {wrongAnswer && (
        <div className="animate-scale-in rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 font-medium">
          ❌ {wrongAnswer}
        </div>
      )}

      <div className="space-y-2">
        {FAMILY.map(f => {
          const dec = decisions[f.id];
          return (
            <div key={f.id} className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${dec === true ? "border-success bg-success/10" : dec === false ? "border-red-200 bg-red-50" : "border-slate-200 bg-card"}`}>
              <span className="text-xl">👤</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{f.name}</p>
                <p className="text-xs text-muted-foreground">Age {f.age}</p>
              </div>
              {dec !== undefined
                ? <span className={`text-sm font-bold ${dec ? "text-success" : "text-red-500"}`}>{dec ? "✓ Approved" : "✗ Rejected"}</span>
                : (
                  <div data-gt-id={`gt-blo-${f.id}`} className="flex gap-2">
                    <button onClick={() => decide(f.id, true)} className="rounded-lg bg-success/15 px-3 py-1.5 text-xs font-bold text-success hover:bg-success/25 transition">✓</button>
                    <button onClick={() => decide(f.id, false)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-100 transition">✗</button>
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="animate-scale-in rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm">
          <p className="font-bold text-blue-800">Why does door-to-door verification matter?</p>
          <p className="mt-1 text-xs text-blue-700">It removes ghost voters, adds new eligible citizens, and keeps the electoral roll accurate — the foundation of a fair election.</p>
        </div>
      )}
    </div>
  );
}

/* ── Step 2.4 Booth Finder ── */
const DEMO_BOOTHS: Record<string, { station: string; part: string; address: string; x: number; y: number }> = {
  default: { station: "Govt. Higher Secondary School, Ward 4", part: "042", address: "12, School Road, Chennai - 600001", x: 55, y: 40 },
};

function BoothFinder({ onDone }: { onDone: () => void }) {
  const txt = useModuleText();
  const [epic, setEpic] = useState("");
  const [found, setFound] = useState(false);
  const [animPin, setAnimPin] = useState(false);

  useGuidedSteps(
    [{ id: "epic", targetId: "gt-epic-input", hint: txt.m2_booth_desc, gesture: "tap" }],
    found ? null : "epic"
  );

  const search = () => {
    if (epic.trim().length < 6) {
      toast({ title: "Enter a valid EPIC number", description: "At least 6 characters needed." });
      return;
    }
    setAnimPin(true);
    setTimeout(() => { setFound(true); onDone(); }, 1000);
  };

  const booth = DEMO_BOOTHS.default;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        {txt.m2_booth_desc}
      </p>

      <div className="flex gap-2">
        <input
          data-gt-id="gt-epic-input"
          value={epic}
          onChange={e => setEpic(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && search()}
          placeholder={txt.m2_booth_placeholder}
          maxLength={20}
          className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm font-mono outline-none ring-0 focus:ring-2 focus:ring-primary transition"
        />
        <Button onClick={search} className="gap-1.5">
          <Search className="h-4 w-4" /> {txt.m2_booth_search}
        </Button>
      </div>

      {/* SVG Map */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100" style={{ height: 220 }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 70">
          {/* streets */}
          <line x1="0" y1="35" x2="100" y2="35" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="50" y1="0" x2="50" y2="70" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="0" y1="20" x2="100" y2="20" stroke="#e2e8f0" strokeWidth="1" />
          <line x1="25" y1="0" x2="25" y2="70" stroke="#e2e8f0" strokeWidth="1" />
          <line x1="75" y1="0" x2="75" y2="70" stroke="#e2e8f0" strokeWidth="1" />
          {/* blocks */}
          {[[5,5,15,10],[30,5,15,10],[55,5,15,10],[5,42,15,10],[30,42,15,10],[60,42,12,10],[5,25,15,5],[55,25,15,5]].map(([x,y,w,h],i)=>(
            <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill="#e2e8f0" />
          ))}
          {/* school highlight */}
          <rect x={48} y={25} width={20} height={14} rx="1.5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" />
          <text x={58} y={33} textAnchor="middle" fontSize="3" fill="#1d4ed8" fontWeight="bold">SCHOOL</text>
          {/* pin */}
          {animPin && (
            <g style={{ animation: "pin-drop 0.6s ease-out forwards" }}>
              <circle cx={booth.x} cy={booth.y} r="3.5" fill="hsl(var(--primary))" />
              <circle cx={booth.x} cy={booth.y} r="6" fill="hsl(var(--primary)/0.2)" />
            </g>
          )}
        </svg>
        {!animPin && <p className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">Enter your EPIC number to locate your booth</p>}
      </div>

      {found && (
        <div className="animate-scale-in rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-bold text-slate-800">{txt.m2_booth_found}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{txt.m2_booth_location}</p>
              <div className="mt-2 flex gap-3">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">Part No. {booth.part}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Booth 7A</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Recap ── */
function Recap2({ onComplete }: { onComplete: () => void }) {
  const txt = useModuleText();
  const ran = useRef(false);
  useEffect(() => { if (!ran.current) { ran.current = true; onComplete(); } }, [onComplete]);
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
        <PartyPopper className="h-10 w-10 text-success" />
      </div>
      <h4 className="text-2xl font-bold">{txt.m2_s5_title}</h4>
      <p className="max-w-md text-sm text-muted-foreground">
        {txt.m2_recap_desc}
      </p>
      <ElectronAvatar size={88} pose="celebrate" />
    </div>
  );
}
