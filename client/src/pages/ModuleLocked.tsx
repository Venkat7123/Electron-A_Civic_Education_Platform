import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { ElectronAvatar } from "@/components/ElectronAvatar";
import { useT } from "@/hooks/useT";

export default function ModuleLocked() {
  const { id } = useParams();
  const t = useT();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-hero">
      <AppHeader showProgress />
      <main className="container py-16">
        <Button variant="ghost" size="sm" className="mb-4 gap-1" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
        <div className="mx-auto max-w-md rounded-3xl bg-card p-10 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Lock className="h-7 w-7 text-muted-foreground" />
          </div>
          <ElectronAvatar size={72} pose="think" className="mx-auto" />
          <h1 className="mt-3 text-xl font-bold">Module {id} is locked</h1>
          <p className="mt-2 text-sm text-muted-foreground">Complete the previous module to unlock this one. Modules 2–4 will be added next, and the guided-touch system is already wired up for them.</p>
          <Button asChild className="mt-5"><Link to="/module/1">Start Module 1</Link></Button>
        </div>
      </main>
    </div>
  );
}