type Pose = "wave" | "point" | "celebrate" | "think" | "idle";

export function ElectronAvatar({ size = 96, pose = "idle", className = "" }: { size?: number; pose?: Pose; className?: string }) {
  const armLeft =
    pose === "wave" ? "M30 70 Q18 60 22 42" :
    pose === "point" ? "M30 70 Q14 70 8 80" :
    pose === "celebrate" ? "M30 70 Q22 50 18 30" :
    "M30 70 Q22 78 18 86";
  const armRight =
    pose === "celebrate" ? "M70 70 Q78 50 82 30" :
    pose === "point" ? "M70 70 Q86 70 92 80" :
    "M70 70 Q78 78 82 86";

  return (
    <svg width={size} height={size} viewBox="0 0 100 110" className={className} aria-label="Electron mascot">
      {/* legs */}
      <path d="M40 92 L40 104" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round" />
      <path d="M60 92 L60 104" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="38" cy="106" rx="7" ry="3" fill="hsl(var(--primary))" />
      <ellipse cx="62" cy="106" rx="7" ry="3" fill="hsl(var(--primary))" />

      {/* body — magnifier circle */}
      <circle cx="50" cy="50" r="38" fill="white" stroke="hsl(var(--primary))" strokeWidth="6" />
      <circle cx="50" cy="50" r="30" fill="hsl(220 80% 97%)" />

      {/* eyes */}
      <circle cx="40" cy="48" r="4.2" fill="hsl(222 47% 14%)" />
      <circle cx="60" cy="48" r="4.2" fill="hsl(222 47% 14%)" />
      <circle cx="41.5" cy="46.5" r="1.3" fill="white" />
      <circle cx="61.5" cy="46.5" r="1.3" fill="white" />

      {/* mouth */}
      <path d="M42 60 Q50 67 58 60" stroke="hsl(222 47% 14%)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* cheeks */}
      <circle cx="34" cy="58" r="3" fill="hsl(0 80% 80% / 0.6)" />
      <circle cx="66" cy="58" r="3" fill="hsl(0 80% 80% / 0.6)" />

      {/* arms */}
      <path d={armLeft} stroke="hsl(var(--primary))" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d={armRight} stroke="hsl(var(--primary))" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx={pose === "wave" ? 22 : pose === "celebrate" ? 18 : pose === "point" ? 8 : 18} cy={pose === "wave" ? 42 : pose === "celebrate" ? 30 : pose === "point" ? 80 : 86} r="4.5" fill="white" stroke="hsl(var(--primary))" strokeWidth="2.5" />
      <circle cx={pose === "celebrate" ? 82 : pose === "point" ? 92 : 82} cy={pose === "celebrate" ? 30 : pose === "point" ? 80 : 86} r="4.5" fill="white" stroke="hsl(var(--primary))" strokeWidth="2.5" />
    </svg>
  );
}