export function EvmIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 480" className={`${className} evm-machine-container`} aria-label="3D Electronic Voting Machine illustration">
      <defs>
        {/* Machine Body Gradients */}
        <linearGradient id="bodyGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="bodyThick" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Screen Gradients */}
        <linearGradient id="screenBezel" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="screenGlass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="50%" stopColor="#022c22" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Button Gradients */}
        <linearGradient id="btnBase" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="btnTop" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="btnTopPressed" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        
        {/* Candidate Block Gradients */}
        <linearGradient id="candBlock" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
        <linearGradient id="candThick" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        {/* Filters */}
        <filter id="shadowLg" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="15" stdDeviation="12" floodColor="#000" floodOpacity="0.2" />
        </filter>
        <filter id="shadowSm" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.15" />
        </filter>
        <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g transform="translate(0, 10)">
        {/* Ground Shadow */}
        <ellipse cx="180" cy="430" rx="140" ry="15" fill="rgba(0,0,0,0.15)" filter="blur(8px)" />

        <g filter="url(#shadowLg)">
          {/* Machine Thickness (Back/Bottom layer) */}
          <rect x="40" y="45" width="280" height="370" rx="20" fill="url(#bodyThick)" />
          {/* Machine Front layer */}
          <rect x="40" y="30" width="280" height="370" rx="20" fill="url(#bodyGrad)" stroke="#ffffff" strokeWidth="1" />
        </g>

        {/* Screen Bezel */}
        <g filter="url(#shadowSm)">
          <rect x="65" y="55" width="230" height="80" rx="12" fill="url(#screenBezel)" />
        </g>
        {/* Screen Glass */}
        <rect x="70" y="60" width="220" height="70" rx="8" fill="url(#screenGlass)" stroke="#020617" strokeWidth="2" />
        
        {/* Screen Glare (Glass Reflection) */}
        <path d="M 72 62 L 288 62 L 288 85 C 200 95 150 95 72 85 Z" fill="rgba(255,255,255,0.05)" />

        {/* Screen Text */}
        <g style={{ transform: "translateY(2px)" }}>
          <text x="180" y="86" textAnchor="middle" fill="#4ade80" fontFamily="ui-monospace, monospace" fontSize="18" fontWeight="800" filter="url(#glowGreen)" letterSpacing="2">EVM 3.0</text>
          <text x="180" y="106" textAnchor="middle" fill="#22c55e" fontFamily="ui-monospace, monospace" fontSize="12" fontWeight="600" letterSpacing="1">SECURE VOTING</text>
          <text x="180" y="122" textAnchor="middle" fill="#16a34a" fontFamily="ui-monospace, monospace" fontSize="10">SYS: ACTIVE</text>
        </g>

        {/* Candidates Section Background Recess */}
        <rect x="60" y="150" width="240" height="235" rx="10" fill="#94a3b8" />
        <rect x="62" y="152" width="236" height="231" rx="8" fill="#e2e8f0" />
        {/* Inner shadow simulation: */}
        <rect x="62" y="152" width="236" height="6" rx="8" fill="rgba(0,0,0,0.1)" />
        <rect x="62" y="152" width="6" height="231" rx="8" fill="rgba(0,0,0,0.05)" />

        {/* Candidate Rows */}
        {Array.from({ length: 8 }).map((_, i) => {
          const y = 162 + i * 28;
          const lit = i === 6;
          return (
            <g key={i}>
              {/* Index Number */}
              <text x="75" y={y + 14} fontSize="12" fontWeight="800" fill="#64748b">{i + 1}</text>
              
              {/* Candidate Name Block 3D */}
              <g filter="url(#shadowSm)">
                <rect x="92" y={y + 3} width="116" height="18" rx="4" fill="url(#candThick)" />
                <rect x="92" y={y} width="116" height="18" rx="4" fill="url(#candBlock)" stroke="#ffffff" strokeWidth="0.5" />
              </g>
              <text x="102" y={y + 13} fontSize="11" fontWeight="600" fill="#334155">Candidate {i + 1}</text>
              
              {/* Status Light 3D */}
              <g filter="url(#shadowSm)">
                <circle cx="225" cy={y + 10} r="7" fill="#64748b" />
              </g>
              <circle cx="225" cy={y + 9} r="5.5" fill={lit ? "#ef4444" : "#cbd5e1"} filter={lit ? "url(#glowRed)" : ""} stroke={lit ? "#b91c1c" : "#94a3b8"} strokeWidth="0.5" />
              {/* Light Reflection */}
              <circle cx="223.5" cy={y + 7.5} r="2" fill="rgba(255,255,255,0.8)" />

              {/* Vote Button 3D */}
              <g filter="url(#shadowSm)">
                <rect x="245" y={y + (lit ? 2 : 4)} width="40" height="16" rx="6" fill="url(#btnBase)" />
                <rect x="245" y={y + (lit ? 2 : 0)} width="40" height="16" rx="6" fill={lit ? "url(#btnTopPressed)" : "url(#btnTop)"} stroke="#60a5fa" strokeWidth="0.5" />
              </g>
            </g>
          );
        })}

      </g>
    </svg>
  );
}