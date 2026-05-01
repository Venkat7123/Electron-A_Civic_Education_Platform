import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, BookOpen, IdCard, Vote, Landmark, ArrowRight, PlayCircle, Lock } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ElectronAvatar } from "@/components/ElectronAvatar";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useT";
import { useProgress } from "@/hooks/useProgress";

const ICONS = [BookOpen, IdCard, Vote, Landmark];
const COLORS = ["bg-success/15 text-success", "bg-primary/15 text-primary", "bg-violet-100 text-violet-600", "bg-orange-100 text-orange-600"];

export default function Dashboard() {
  const t = useT();
  const { state, overall } = useProgress();
  const [chat, setChat] = useState(false);

  const cards = [
    { id: 1 as const, title: t("m1"), desc: t("m1d") },
    { id: 2 as const, title: t("m2"), desc: t("m2d") },
    { id: 3 as const, title: t("m3"), desc: t("m3d") },
    { id: 4 as const, title: t("m4"), desc: t("m4d") },
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/dashboard.png')" }}
    >
      <AppHeader onChat={() => setChat(!chat)} showProgress />
      <main className="container py-10">
        <div className="mb-8 flex items-center gap-4">
          <ElectronAvatar size={72} pose="point" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
              {t("dashboard")}
            </h1>
            <p className="text-muted-foreground">{t("dashboardSub")}</p>
          </div>
          <div className="ml-auto hidden items-center gap-4 md:flex">
            {overall === 100 ? (
              <Button asChild variant="default" className="bg-amber-500 hover:bg-amber-600">
                <Link to="/certificate">🏆 Claim Certificate</Link>
              </Button>
            ) : (
              <Button disabled variant="outline" className="opacity-50">
                🔒 Certificate Locked
              </Button>
            )}
            <ProgressRing value={overall} />
          </div>
        </div>

        {/* Mobile Certificate Button */}
        <div className="mb-6 flex items-center justify-between md:hidden rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ProgressRing value={overall} />
            <div>
              <p className="text-sm font-semibold">Your Progress</p>
              <p className="text-xs text-muted-foreground">{overall}% Completed</p>
            </div>
          </div>
          {overall === 100 ? (
            <Button asChild variant="default" size="sm" className="bg-amber-500 hover:bg-amber-600">
              <Link to="/certificate">🏆 Claim</Link>
            </Button>
          ) : (
            <Button disabled variant="outline" size="sm" className="opacity-50">
              🔒 Locked
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {cards.map((c, i) => {
            const m = state.modules[c.id];
            const unlocked = c.id === 1 || state.modules[(c.id - 1) as 1 | 2 | 3].completed;
            const Icon = ICONS[i];
            const statusLabel = !unlocked
              ? "Locked"
              : m.completed
              ? "Completed"
              : m.progress > 0
              ? `${m.progress}% done`
              : "Not started";
            return (
              <div key={c.id} className={`group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 ${unlocked ? "hover:shadow-lg" : "opacity-75"}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${COLORS[i]} ${unlocked ? "" : "grayscale"}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{c.id}. {c.title}</h3>
                      {m.completed ? <CheckCircle2 className="h-5 w-5 text-success" /> : !unlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{c.desc}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-gradient-primary transition-all" style={{ width: `${m.progress}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-xs font-medium ${
                        !unlocked ? "text-muted-foreground" : m.completed ? "text-success" : m.progress > 0 ? "text-primary" : "text-muted-foreground"
                      }`}>{statusLabel}</span>
                      <Button asChild={unlocked} size="sm" variant={unlocked ? "default" : "secondary"} disabled={!unlocked}>
                        {unlocked ? (
                          <Link to={`/module/${c.id}`}>
                            {m.completed ? "Review" : m.progress > 0 ? "Continue" : "Start"}
                            {m.progress > 0 && !m.completed
                              ? <PlayCircle className="ml-1 h-3 w-3" />
                              : <ArrowRight className="ml-1 h-3 w-3" />}
                          </Link>
                        ) : (
                          <span>Locked</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-card">
          <div>
            <h3 className="font-semibold">Ready to begin?</h3>
            <p className="text-sm text-muted-foreground">Take the guided tour through the Electron learning journey.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="default"><Link to="/roadmap">{t("journey")}</Link></Button>
          </div>
        </div>
      </main>

      <ChatSidebar open={chat} onClose={() => setChat(false)} moduleKey="dashboard" contextLabel={t("dashboard")} />
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative h-20 w-20">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
        <circle cx="40" cy="40" r={r} stroke="hsl(var(--secondary))" strokeWidth="8" fill="none" />
        <circle cx="40" cy="40" r={r} stroke="hsl(var(--primary))" strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} className="transition-all" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs font-semibold">
        <span className="text-base">{value}%</span>
        <span className="text-[9px] text-muted-foreground">Overall</span>
      </div>
    </div>
  );
}