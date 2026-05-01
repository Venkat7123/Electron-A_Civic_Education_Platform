import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ElectronAvatar } from "./ElectronAvatar";
import { TricolorBand } from "./IndiaSkyline";
import { useT } from "@/hooks/useT";

export function AuthShell({ children, bgImage }: { children: ReactNode, bgImage?: string }) {
  const t = useT();
  return (
    <div 
      className={`relative flex min-h-screen flex-col overflow-hidden ${bgImage ? "bg-cover bg-center" : "bg-gradient-auth"}`}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2">
          <ElectronAvatar size={32} />
          <span className="text-lg font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
            {t("appName")}
          </span>
        </Link>
      </div>
      <main className="container relative z-10 flex flex-1 items-center justify-center py-8">
        {children}
      </main>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-0">
        
      </div>
      <TricolorBand />
    </div>
  );
}