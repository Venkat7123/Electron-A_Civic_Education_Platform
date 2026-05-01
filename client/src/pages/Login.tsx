import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/AuthShell";
import { useT } from "@/hooks/useT";
import { useProgress } from "@/hooks/useProgress";
import { toast } from "@/hooks/use-toast";
import GoogleG from "@/components/GoogleG";
import { auth, googleProvider } from "@/gcp/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function Login() {
  const t = useT();
  const nav = useNavigate();
  const { setEmail, setName, state } = useProgress();
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
      const userCredential = await signInWithEmailAndPassword(auth, email, pwd);
      setEmail(email);
      setName(userCredential.user.displayName || email.split("@")[0] || "Friend");
      nav("/dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setEmail(result.user.email || "");
      setName(result.user.displayName || result.user.email?.split("@")[0] || "Friend");
      nav("/dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AuthShell bgImage="/login.png">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-card">
        <h1 className="text-2xl font-bold">{t("welcomeBack")}</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">{t("loginSub")}</p>

        <form className="space-y-3" onSubmit={submit}>
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
          <div className="text-right">
            <a className="text-xs font-medium text-primary hover:underline" href="#">{t("forgot")}</a>
          </div>
          <Button type="submit" className="w-full">{t("login")}</Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> {t("or")} <div className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="w-full gap-2" type="button" onClick={handleGoogleLogin}>
          <GoogleG /> {t("signInGoogle")}
        </Button>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {t("noAccount")} <Link className="font-semibold text-primary hover:underline" to="/signup">{t("signup")}</Link>
        </p>
      </div>
    </AuthShell>
  );
}