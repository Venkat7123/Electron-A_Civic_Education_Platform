import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/AuthShell";
import { useT } from "@/hooks/useT";
import { useProgress } from "@/hooks/useProgress";
import { SUPPORTED, type Lang } from "@/i18n";
import { toast } from "@/hooks/use-toast";
import GoogleG from "@/components/GoogleG";
import { auth, googleProvider } from "@/gcp/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";

export default function Signup() {
  const t = useT();
  const nav = useNavigate();
  const { state, setName, setEmail, setLang } = useProgress();
  const [name, setLocalName] = useState(state.name === "Friend" ? "" : state.name);
  const [email, setLocalEmail] = useState(state.email);
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (state.email) {
      nav("/dashboard");
    }
  }, [state.email, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pwd);
      const displayName = name || "Friend";
      await updateProfile(userCredential.user, { displayName });
      setName(displayName);
      setEmail(email);
      nav("/dashboard");
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setName(result.user.displayName || "Friend");
      setEmail(result.user.email || "");
      nav("/dashboard");
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    }
  };

  const choose = (l: Lang, ready: boolean) => {
    if (!ready) {
      toast({ title: t("comingSoon"), description: SUPPORTED.find(s => s.code === l)?.native });
      return;
    }
    setLang(l);
  };

  return (
    <AuthShell bgImage="/signup.png">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-card relative">
        <Button variant="ghost" size="icon" onClick={() => nav(-1)} className="absolute left-4 top-4 h-8 w-8 rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="mt-2 text-center text-2xl font-bold">{t("createAccount")}</h1>
        <p className="mb-6 mt-1 text-center text-sm text-muted-foreground">{t("joinSub")}</p>

        <form className="space-y-3" onSubmit={submit}>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" required placeholder={t("fullName")} value={name} onChange={e => setLocalName(e.target.value)} />
          </div>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" type="email" required placeholder={t("email")} value={email} onChange={e => setLocalEmail(e.target.value)} />
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9 pr-9" type={show ? "text" : "password"} required placeholder={t("password")} value={pwd} onChange={e => setPwd(e.target.value)} />
            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="pt-1">
            <p className="mb-2 text-sm font-medium">{t("preferLang")}</p>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED.map(l => {
                const active = state.lang === l.code;
                return (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => choose(l.code, l.ready)}
                    className={`rounded-full px-4 py-1.5 text-sm transition ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
                  >
                    {l.native}{!l.ready && <span className="ml-1 text-[9px] opacity-60">soon</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" className="mt-2 w-full">{t("signup")}</Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> {t("or")} <div className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="w-full gap-2" type="button" onClick={handleGoogleSignup}>
          <GoogleG /> {t("signupGoogle")}
        </Button>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {t("haveAccount")} <Link className="font-semibold text-primary hover:underline" to="/login">{t("login")}</Link>
        </p>
      </div>
    </AuthShell>
  );
}