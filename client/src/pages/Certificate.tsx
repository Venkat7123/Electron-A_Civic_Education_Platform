import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { ElectronAvatar } from "@/components/ElectronAvatar";
import { useT } from "@/hooks/useT";
import { useProgress } from "@/hooks/useProgress";

export default function Certificate() {
  const t = useT();
  const nav = useNavigate();
  const { state } = useProgress();
  const ref = useRef<HTMLDivElement>(null);

  const download = async () => {
    if (!ref.current) return;
    const url = await toPng(ref.current, { pixelRatio: 2, cacheBust: true });
    const a = document.createElement("a"); a.href = url; a.download = `electron-certificate-${state.name}.png`; a.click();
  };

  const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const items = [t("m1"), t("m2"), t("m3"), t("m4")];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <AppHeader showProgress />
      <main className="container py-8">
        <Button variant="ghost" size="sm" className="mb-4 gap-1" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4" /> Back</Button>

        <div ref={ref} className="relative mx-auto max-w-3xl rounded-2xl bg-white p-10" style={{ border: "10px double hsl(var(--gold))" }}>
          <div className="absolute inset-3 rounded-xl border border-gold/40" />
          <div className="relative text-center">
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', serif" }}>{t("certTitle")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("certPresented")}</p>
            <p className="my-3 text-4xl font-bold italic text-primary" style={{ fontFamily: "Georgia, serif" }}>{state.name}</p>
            <p className="text-sm text-muted-foreground">{t("certFor")}<br />{t("certProgram")}</p>

            <ul className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-2 text-left text-sm">
              {items.map(i => (
                <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> {i}</li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between text-sm">
              <div className="text-left">{t("date")}: <span className="font-semibold">{date}</span></div>
              <div className="text-right">
                <p className="font-bold text-primary">{t("appName")}</p>
                <p className="text-xs text-muted-foreground">{t("certCompanion")}</p>
              </div>
            </div>

            <div className="absolute -right-2 -top-2 flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 ring-4 ring-gold/50">
              <ElectronAvatar size={56} pose="celebrate" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={download} className="gap-2"><Download className="h-4 w-4" /> {t("download")}</Button>
        </div>
      </main>
    </div>
  );
}