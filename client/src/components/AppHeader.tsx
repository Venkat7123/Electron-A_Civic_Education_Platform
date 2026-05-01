import { Link, NavLink, useNavigate } from "react-router-dom";
import { Globe, MessageCircle, Sparkles, UserCircle, LogOut, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ElectronAvatar } from "./ElectronAvatar";
import { useProgress } from "@/hooks/useProgress";
import { useT } from "@/hooks/useT";
import { SUPPORTED, type Lang } from "@/i18n";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/gcp/firebase";

export function AppHeader({ onChat, showProgress = false, marketing = false }: { onChat?: () => void; showProgress?: boolean; marketing?: boolean }) {
  const t = useT();
  const nav = useNavigate();
  const { state, setLang, overall, reset } = useProgress();

  const pickLang = (l: Lang, ready: boolean) => {
    if (!ready) {
      toast({ title: t("comingSoon"), description: SUPPORTED.find(s => s.code === l)?.native });
      return;
    }
    setLang(l);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Left: Logo Only */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="transition-transform group-hover:scale-110">
              <ElectronAvatar size={44} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">
              Electron
            </span>
          </Link>
        </div>

        {/* Center: Marketing Links (if any) */}
        {marketing && (
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#about" className="hover:text-foreground">{t("about")}</a>
            <NavLink to="/roadmap" className="hover:text-foreground">{t("roadmap")}</NavLink>
            <NavLink to="/dashboard" className="hover:text-foreground">{t("modules")}</NavLink>
            <a href="#contact" className="hover:text-foreground">{t("contact")}</a>
          </nav>
        )}

        {/* Right: Tools & Profile */}
        <div className="flex items-center gap-3">
          {showProgress && (
            <div className="hidden items-center gap-3 rounded-full border bg-slate-50/50 px-3 py-1 sm:flex transition-all hover:bg-white">
              <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <div className="text-xs">
                <span className="font-black text-slate-800">{overall}%</span>
                <span className="ml-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Progress</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="h-4 w-4 text-slate-500" />
              <div className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive border-2 border-white" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg border-slate-200 px-2 font-bold text-slate-600 hover:bg-slate-50 sm:flex">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  <span className="hidden md:inline">{SUPPORTED.find(s => s.code === state.lang)?.native ?? "English"}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                {SUPPORTED.map(l => (
                  <DropdownMenuItem key={l.code} onClick={() => pickLang(l.code, l.ready)} className="font-medium">
                    <span className="mr-2">{l.native}</span>
                    {!l.ready && <span className="ml-auto text-[10px] text-muted-foreground bg-slate-100 px-1.5 rounded">soon</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {onChat && (
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={onChat} aria-label="Open chat">
                <MessageCircle className="h-4 w-4 text-slate-500" />
              </Button>
            )}
            
            {state.email ? (
              <div className="group relative z-50">
                <button className="flex items-center gap-2 rounded-full p-0.5 transition-all hover:ring-4 hover:ring-primary/10">
                  <div className="rounded-full ring-2 ring-primary/20 ring-offset-1 ring-offset-background shadow-sm transition-all group-hover:ring-primary/40">
                    <ElectronAvatar size={36} />
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 hidden w-64 rounded-2xl border bg-white p-5 shadow-2xl group-hover:block animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-4 mb-6 px-1">
                    <ElectronAvatar size={52} />
                    <div className="flex-1 overflow-hidden">
                      <p className="font-black text-slate-800 text-base truncate">{state.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest mt-0.5">{state.email}</p>
                    </div>
                  </div>
                  <div className="h-px bg-slate-100 mb-4" />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full gap-2 rounded-xl font-black shadow-lg shadow-destructive/20" 
                    onClick={async () => {
                      await auth.signOut();
                      reset();
                      nav("/");
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              marketing && (
                <Button asChild variant="default" size="sm" className="h-8 rounded-lg px-4 font-bold shadow-lg shadow-primary/20">
                  <Link to="/login">{t("login")}</Link>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}