import React from "react";

export function BarleyCrest({ size = 80, withText = true, mono = false }: { size?: number; withText?: boolean; mono?: boolean }) {
  const stroke = mono ? "currentColor" : "var(--color-gold)";
  const text = mono ? "currentColor" : "var(--color-cream)";
  return (
    <svg
      viewBox="0 0 120 140"
      width={size}
      height={(size * 140) / 120}
      role="img"
      aria-label="Timothy Taylor's barley crest"
    >
      <defs>
        <radialGradient id="crestBg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      {/* Barley ear left */}
      <g stroke={stroke} fill="none" strokeWidth="1.6" strokeLinecap="round">
        <path d="M48 22 C 36 38 30 60 30 90" />
        <g transform="translate(48 22)">
          <path d="M0 0 c -8 -2 -12 4 -14 10 c -6 -4 -12 0 -14 8 c -7 -2 -12 4 -13 12 c -7 -1 -12 6 -12 14 c -7 1 -11 9 -10 16" />
          <path d="M0 0 c 0 6 4 10 10 12" />
        </g>
        <path d="M40 38 q -10 4 -10 14" />
        <path d="M36 50 q -10 4 -10 14" />
        <path d="M33 64 q -10 4 -10 14" />
        <path d="M31 78 q -10 4 -10 14" />
      </g>
      {/* Barley ear right (mirrored) */}
      <g stroke={stroke} fill="none" strokeWidth="1.6" strokeLinecap="round">
        <path d="M72 22 C 84 38 90 60 90 90" />
        <path d="M80 38 q 10 4 10 14" />
        <path d="M84 50 q 10 4 10 14" />
        <path d="M87 64 q 10 4 10 14" />
        <path d="M89 78 q 10 4 10 14" />
      </g>
      {/* Centre stem */}
      <line x1="60" y1="22" x2="60" y2="100" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      {/* Grain heads at top */}
      <g fill={stroke}>
        <ellipse cx="60" cy="16" rx="3" ry="6" />
        <ellipse cx="52" cy="22" rx="2.4" ry="5" transform="rotate(-18 52 22)" />
        <ellipse cx="68" cy="22" rx="2.4" ry="5" transform="rotate(18 68 22)" />
      </g>
      <circle cx="60" cy="60" r="58" fill="url(#crestBg)" />
      {withText && (
        <g fontFamily="var(--font-serif)" textAnchor="middle" fill={text}>
          <text x="60" y="118" fontSize="11" letterSpacing="2">
            TIMOTHY TAYLOR'S
          </text>
          <text x="60" y="132" fontSize="7" letterSpacing="3" opacity="0.7">
            EST. 1858 · KEIGHLEY
          </text>
        </g>
      )}
    </svg>
  );
}

export function WordMark({ className = "", small = false }: { className?: string; small?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span style={{ color: "var(--color-gold)" }}>
        <BarleyCrest size={small ? 22 : 30} withText={false} mono />
      </span>
      <span
        className="font-serif tracking-wide"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: small ? "0.95rem" : "1.05rem",
          letterSpacing: "0.04em",
        }}
      >
        TIMOTHY TAYLOR'S
      </span>
    </div>
  );
}
