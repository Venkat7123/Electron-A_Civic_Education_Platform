import { Link } from "react-router-dom";
import { ArrowRight, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { ElectronAvatar } from "@/components/ElectronAvatar";
import { EvmIllustration } from "@/components/EvmIllustration";
import { TricolorBand } from "@/components/IndiaSkyline";
import { useT } from "@/hooks/useT";

export default function Index() {
  const t = useT();
  return (
    <div 
      className="relative min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/home.png')" }}
    >
      <AppHeader marketing />

      <main className="container relative z-10 grid min-h-[calc(100vh-16rem)] grid-cols-1 items-center gap-10 pt-0 pb-2 md:grid-cols-2">
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="animate-float-y">
              <ElectronAvatar size={120} pose="wave" />
            </div>
            <span className="rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              ✨ Civic learning, guided
            </span>
          </div>

          <h1
            className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl"
            style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
          >
            {t("tagline")}
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">{t("heroSub")}</p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/login"><UserCircle2 className="h-5 w-5" /> {t("login")} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/signup"><UserCircle2 className="h-5 w-5" /> {t("signup")}</Link>
            </Button>
          </div>
        </section>

        <section className="relative flex items-center justify-center">
          <div className="absolute inset-0 -z-10 mx-auto h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <EvmIllustration className="w-full max-w-[420px] drop-shadow-xl" />
        </section>
      </main>

      
      <TricolorBand className="absolute inset-x-0 bottom-0" />
    </div>
  );
}
