import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Check, Flag, IdCard, Info, Landmark, PlayCircle, Vote, Lock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { TricolorBand } from "@/components/IndiaSkyline";
import { useProgress } from "@/hooks/useProgress";

const MODULES = [
  {
    id: 1,
    icon: BookOpen,
    title: "Pre-Election Campaigning",
    desc: "Announcements, nominations, manifestos & the Model Code of Conduct.",
    steps: ["Official Announcement", "Candidate Nominations", "Manifestos", "Code of Conduct"],
    x: 16, y: 70,
  },
  {
    id: 2,
    icon: IdCard,
    title: "Voter Registration & ID",
    desc: "Register as a new voter, update details, and find your polling booth.",
    steps: ["Form 6 — New Voter", "Form 8 — Updates", "SIR Verification", "Booth Finder"],
    x: 41, y: 52,
  },
  {
    id: 3,
    icon: Vote,
    title: "Election Day at the Booth",
    desc: "From entering the booth to pressing the EVM and watching the VVPAT.",
    steps: ["Entering the Station", "Indelible Ink", "EVM & VVPAT"],
    x: 66, y: 32,
  },
  {
    id: 4,
    icon: Landmark,
    title: "Post-Election & Results",
    desc: "Sealing, counting, VVPAT audit, and the winner declaration.",
    steps: ["Sealing & Strong Room", "Counting Day", "VVPAT Audit", "Winner Declaration"],
    x: 90, y: 14,
  },
];

export default function Roadmap() {
  const nav = useNavigate();
  const { state } = useProgress();

  // Active module = highest progress that isn't completed; fallback to first incomplete, then last
  const currentModuleId = (() => {
    const ids = [1, 2, 3, 4] as const;
    // Find module with most progress that isn't done yet
    const inProgress = ids.filter(id => !state.modules[id].completed && state.modules[id].progress > 0);
    if (inProgress.length > 0) {
      return inProgress.reduce((best, id) =>
        state.modules[id].progress > state.modules[best].progress ? id : best
      );
    }
    // All fresh — return first not-started
    const notStarted = ids.find(id => !state.modules[id].completed);
    return notStarted ?? 0;
  })();
  const currentModule = MODULES.find(m => m.id === currentModuleId) || MODULES[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc]">
      <AppHeader showProgress />

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-[5%] top-[10%] h-48 w-48 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute right-[10%] top-[30%] h-64 w-64 rounded-full bg-orange-50 blur-3xl" />
      </div>

      <main className="container relative z-10 py-5 pb-20">
        <header className="mb-6">
          <h1 className="text-2xl font-black text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
            Citizen's <span className="text-primary">Odyssey</span>
          </h1>
          <p className="max-w-md text-[13px] font-medium text-slate-500">
            4 Modules · 14 Interactive Steps · Master the Indian Election Process.
          </p>
        </header>

        {/* Journey Map */}
        <div className="relative mx-auto h-[380px] w-full max-w-4xl">
          {/* Dashed path */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            <path
              d="M 16 70 C 25 70, 30 52, 41 52 C 52 52, 55 32, 66 32 C 77 32, 80 14, 90 14"
              stroke="url(#pathGrad)" strokeWidth="0.8" strokeDasharray="2 2"
              fill="none" className="animate-pulse"
            />
          </svg>

          {/* Module Nodes */}
          {MODULES.map(m => {
            const id = m.id as 1 | 2 | 3 | 4;
            const progress = state.modules[id];
            const unlocked = id === 1 || state.modules[(id - 1) as 1 | 2 | 3].completed;
            const isCurrent = id === currentModuleId;
            const Icon = m.icon;
            const stepsTotal = m.steps.length;
            const stepsDone = Math.round((progress.progress / 100) * stepsTotal);

            return (
              <div
                key={id}
                className="absolute flex flex-col items-center group transition-all -translate-x-1/2 -translate-y-7"
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
              >
                {/* Node button */}
                <button
                  onClick={() => unlocked && nav(`/module/${id}`)}
                  className={`
                    relative z-20 flex h-14 w-14 items-center justify-center rounded-full shadow-md transition-all duration-300
                    ${isCurrent ? "scale-110 ring-4 ring-primary ring-offset-2 ring-offset-[#f8fafc] bg-primary text-white shadow-xl shadow-primary/20" : ""}
                    ${progress.completed ? "bg-white text-primary border-2 border-primary hover:scale-105" : ""}
                    ${!unlocked ? "bg-slate-100 text-slate-300 cursor-not-allowed" : !isCurrent && !progress.completed ? "bg-white text-slate-500 hover:shadow-lg hover:scale-105 border border-slate-100" : ""}
                  `}
                >
                  {progress.completed
                    ? <Check className="h-5 w-5" />
                    : !unlocked
                    ? <Lock className="h-4 w-4" />
                    : isCurrent
                    ? <Flag className="h-5 w-5" />
                    : <Icon className="h-5 w-5" />}
                  {isCurrent && <span className="absolute -z-10 h-full w-full animate-ping rounded-full bg-primary/20" />}
                </button>

                {/* Label + sub-step dots */}
                <div className="mt-2 w-36 text-center">
                  <p className="text-[10px] font-black uppercase tracking-tight text-slate-700 leading-tight">{m.title}</p>
                  {/* Sub-step dots */}
                  <div className="mt-1 flex justify-center gap-1">
                    {m.steps.map((_, si) => (
                      <div
                        key={si}
                        className={`h-1.5 rounded-full transition-all ${
                          si < stepsDone ? "w-3 bg-primary" : si === stepsDone && isCurrent ? "w-3 bg-primary/40 animate-pulse" : "w-1.5 bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-0.5 text-[9px] text-slate-400">{stepsTotal} steps</p>
                </div>

                {/* Active quest card (shows above current node) */}
                {isCurrent && (
                  <div className="absolute -top-44 left-1/2 z-30 w-52 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="rounded-xl border bg-white p-3 shadow-xl ring-1 ring-black/5">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-primary">Active Quest</span>
                        <Flag className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <h4 className="mb-1 text-[11px] font-black text-slate-800 leading-tight">{m.title}</h4>
                      <p className="mb-2 text-[9px] leading-relaxed text-slate-500">{m.desc}</p>
                      {/* Mini step list */}
                      <div className="mb-2 space-y-0.5">
                        {m.steps.slice(0, 3).map((s, si) => (
                          <div key={si} className="flex items-center gap-1.5">
                            <div className={`h-1.5 w-1.5 rounded-full ${si < stepsDone ? "bg-primary" : "bg-slate-200"}`} />
                            <p className={`text-[8px] ${si < stepsDone ? "text-primary font-semibold" : "text-slate-400"}`}>{s}</p>
                          </div>
                        ))}
                        {m.steps.length > 3 && (
                          <p className="text-[8px] text-slate-400 pl-3">+{m.steps.length - 3} more…</p>
                        )}
                      </div>
                      <Button size="sm" className="h-7 w-full rounded-lg text-[10px] font-black shadow-md shadow-primary/20"
                        onClick={() => nav(`/module/${id}`)}>
                        Enter Module
                      </Button>
                    </div>
                    <div className="mx-auto mt-0 h-2.5 w-2.5 rotate-45 border-b border-r bg-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action bar */}
        <div className="mt-2 flex items-center justify-center gap-4">
          {state.modules[4].completed ? (
            <Button
              size="lg"
              className="group relative h-12 rounded-xl bg-amber-500 px-8 text-sm font-black text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105 hover:bg-amber-600 hover:shadow-xl active:scale-95"
              onClick={() => nav(`/certificate`)}
            >
              <Trophy className="mr-2.5 h-5 w-5" />
              Claim Certificate
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="group relative h-12 rounded-xl bg-primary px-8 text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                onClick={() => nav(`/module/${currentModuleId}`)}
              >
                <PlayCircle className="mr-2.5 h-5 w-5" />
                {state.modules[1].progress > 0 || currentModuleId > 1 ? "Continue Journey" : "Begin Journey"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <div className="flex h-12 items-center gap-2.5 rounded-xl border bg-white/80 px-5 shadow-sm backdrop-blur-sm">
                <Info className="h-3.5 w-3.5 text-slate-400" />
                <p className="whitespace-nowrap text-[12px] font-medium text-slate-500">
                  Next: <span className="font-black text-slate-700">{currentModule.title}</span>
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <TricolorBand className="absolute inset-x-0 bottom-0 h-1.5" />
    </div>
  );
}