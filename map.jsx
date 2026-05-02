// SF stylized map shape — hand-drawn-ish peninsula silhouette
// Returns an SVG path that fits viewBox 0 0 100 100

function SFMapSVG({ children }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <defs>
        <pattern id="dots" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
          <circle cx="0.5" cy="0.5" r="0.4" fill="#2F5233" opacity="0.18" />
        </pattern>
        <pattern id="waves" x="0" y="0" width="6" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 2 Q 1.5 0, 3 2 T 6 2" stroke="#7FC4FF" strokeWidth="0.4" fill="none" opacity="0.5" />
        </pattern>
        <filter id="rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feDisplacementMap in="SourceGraphic" scale="0.5" />
        </filter>
      </defs>

      {/* Bay water */}
      <rect x="0" y="0" width="100" height="100" fill="#C9E8FF" />
      <rect x="0" y="0" width="100" height="100" fill="url(#waves)" />

      {/* SF peninsula — stylized blob */}
      <path
        d="M 14,28 Q 18,20 26,22 Q 34,18 44,22 Q 52,20 60,26 Q 66,30 64,38 Q 70,42 66,50 Q 70,58 64,64 Q 60,72 52,76 Q 44,82 34,80 Q 24,82 18,76 Q 12,70 14,60 Q 10,52 14,44 Q 10,36 14,28 Z"
        fill="#FFF8E7"
        stroke="#1a1a1a"
        strokeWidth="0.6"
      />
      <path
        d="M 14,28 Q 18,20 26,22 Q 34,18 44,22 Q 52,20 60,26 Q 66,30 64,38 Q 70,42 66,50 Q 70,58 64,64 Q 60,72 52,76 Q 44,82 34,80 Q 24,82 18,76 Q 12,70 14,60 Q 10,52 14,44 Q 10,36 14,28 Z"
        fill="url(#dots)"
      />

      {/* Golden Gate Park — green rectangle */}
      <rect x="14" y="48" width="20" height="6" fill="#8FBF3F" opacity="0.55" rx="1" />
      <text x="24" y="52.4" fontSize="2" fontFamily="'Space Mono', monospace" fill="#2F5233" textAnchor="middle" fontWeight="700">
        GG PARK
      </text>

      {/* Presidio */}
      <path d="M 16,28 Q 22,26 28,30 Q 26,36 18,34 Z" fill="#8FBF3F" opacity="0.45" />
      <text x="22" y="31" fontSize="1.6" fontFamily="'Space Mono', monospace" fill="#2F5233" textAnchor="middle" fontWeight="700">PRESIDIO</text>

      {/* Twin Peaks dot */}
      <circle cx="40" cy="58" r="2.2" fill="#8FBF3F" opacity="0.55" />
      <text x="40" y="62.5" fontSize="1.5" fontFamily="'Space Mono', monospace" fill="#2F5233" textAnchor="middle">twin peaks</text>

      {/* Bay Bridge */}
      <line x1="64" y1="46" x2="92" y2="42" stroke="#1a1a1a" strokeWidth="0.4" strokeDasharray="1 0.8" />
      {/* Golden Gate Bridge */}
      <line x1="32" y1="22" x2="32" y2="6" stroke="#FF4FA8" strokeWidth="0.6" strokeDasharray="1.5 0.5" />

      {/* Marin (top) */}
      <path d="M 0,0 L 100,0 L 100,18 Q 80,16 60,12 Q 40,8 20,12 Q 8,14 0,12 Z" fill="#E8F0D8" stroke="#1a1a1a" strokeWidth="0.4" />
      <text x="20" y="8" fontSize="2" fontFamily="'Space Mono', monospace" fill="#2F5233" fontWeight="700">MARIN</text>

      {/* East Bay */}
      <path d="M 80,30 Q 90,32 100,30 L 100,100 L 76,100 Q 78,80 76,60 Q 80,46 80,30 Z"
        fill="#E8F0D8" stroke="#1a1a1a" strokeWidth="0.4" />
      <text x="88" y="50" fontSize="2.2" fontFamily="'Space Mono', monospace" fill="#2F5233" fontWeight="700">EAST BAY</text>
      <text x="88" y="54" fontSize="1.6" fontFamily="'Space Mono', monospace" fill="#2F5233">oakland · berkeley</text>

      {/* Daly City / South */}
      <path d="M 18,80 Q 30,84 50,82 Q 64,80 76,82 L 76,100 L 14,100 Z"
        fill="#E8F0D8" stroke="#1a1a1a" strokeWidth="0.4" />
      <text x="40" y="92" fontSize="1.8" fontFamily="'Space Mono', monospace" fill="#2F5233" fontWeight="700">DALY CITY</text>

      {/* Neighborhood whispers on the city */}
      <text x="42" y="44" fontSize="1.4" fontFamily="'Space Mono', monospace" fill="#2F5233" opacity="0.5">japantown</text>
      <text x="55" y="58" fontSize="1.4" fontFamily="'Space Mono', monospace" fill="#2F5233" opacity="0.5">mission</text>
      <text x="60" y="49" fontSize="1.4" fontFamily="'Space Mono', monospace" fill="#2F5233" opacity="0.5">soma</text>
      <text x="49" y="38" fontSize="1.4" fontFamily="'Space Mono', monospace" fill="#2F5233" opacity="0.5">russian hill</text>
      <text x="38" y="41" fontSize="1.4" fontFamily="'Space Mono', monospace" fill="#2F5233" opacity="0.5">pac hts</text>
      <text x="56" y="36" fontSize="1.4" fontFamily="'Space Mono', monospace" fill="#2F5233" opacity="0.5">n. beach</text>
      <text x="36" y="30" fontSize="1.4" fontFamily="'Space Mono', monospace" fill="#2F5233" opacity="0.5">marina</text>
      <text x="28" y="56" fontSize="1.4" fontFamily="'Space Mono', monospace" fill="#2F5233" opacity="0.5">sunset</text>
      <text x="56" y="76" fontSize="1.4" fontFamily="'Space Mono', monospace" fill="#2F5233" opacity="0.5">bernal</text>
      <text x="16" y="60" fontSize="1.4" fontFamily="'Space Mono', monospace" fill="#2F5233" opacity="0.5">outer sunset</text>

      {/* Compass rose */}
      <g transform="translate(91, 90)">
        <circle r="4" fill="#FFF8E7" stroke="#1a1a1a" strokeWidth="0.4" />
        <path d="M 0,-3 L 0.6,0 L 0,3 L -0.6,0 Z" fill="#FF4FA8" />
        <text y="-4.5" fontSize="1.6" fontFamily="'Space Mono', monospace" fill="#1a1a1a" textAnchor="middle" fontWeight="700">N</text>
      </g>

      {/* Decorative sticker stars on water */}
      <text x="6" y="40" fontSize="3.5">✦</text>
      <text x="92" y="20" fontSize="3.5" transform="rotate(15 92 20)">✦</text>
      <text x="78" y="72" fontSize="3.5" transform="rotate(-10 78 72)">✿</text>

      {children}
    </svg>
  );
}

window.SFMapSVG = SFMapSVG;
