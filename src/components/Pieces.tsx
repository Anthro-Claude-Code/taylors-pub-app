"use client";
import React from "react";
import type { Pub, Vibe, BeerSlug } from "@/lib/types";
import { beerBySlug } from "@/lib/seed";

export function Pill({ children, tone = "neutral", className = "" }: { children: React.ReactNode; tone?: "neutral" | "gold" | "green" | "amber" | "ink"; className?: string }) {
  const styles = {
    neutral: { background: "var(--color-line-soft)", color: "var(--color-ink)" },
    gold: { background: "var(--color-gold-soft)", color: "var(--color-bottle-deep)" },
    green: { background: "var(--color-bottle)", color: "var(--color-cream)" },
    amber: { background: "var(--color-amber)", color: "var(--color-cream)" },
    ink: { background: "var(--color-ink)", color: "var(--color-cream)" },
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-1 text-xs font-medium ${className}`}
      style={styles}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-paper)] card-bevel ${className}`}
    >
      {children}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-ink-mute)] font-medium">{label}</div>
      <div className="text-2xl font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
        {value}
      </div>
      {hint && <div className="text-xs text-[color:var(--color-ink-soft)] mt-0.5">{hint}</div>}
    </div>
  );
}

export function VibePill({ vibe, count, mini = false }: { vibe: Vibe; count?: number; mini?: boolean }) {
  const map: Record<Vibe, { dot: string; label: string }> = {
    quiet: { dot: "#7a7e76", label: "Quiet" },
    cosy: { dot: "#c9a961", label: "Cosy" },
    buzzing: { dot: "#b86e1f", label: "Buzzing" },
    "live music": { dot: "#9b3232", label: "Live music" },
  };
  const v = map[vibe];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/70 hairline ${mini ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}`}>
      <span className="live-pulse rounded-full" style={{ background: v.dot, width: 7, height: 7 }} />
      <span className="font-medium" style={{ color: "var(--color-ink)" }}>
        {v.label}
      </span>
      {typeof count === "number" && (
        <>
          <span className="text-[color:var(--color-line)]">·</span>
          <span className="text-[color:var(--color-ink-soft)]">{count} in</span>
        </>
      )}
    </span>
  );
}

export function BeerPump({ slug, size = 44, label = false }: { slug: BeerSlug; size?: number; label?: boolean }) {
  const beer = beerBySlug(slug);
  if (!beer) return null;
  const w = size;
  const h = (size * 60) / 44;
  return (
    <div className="inline-flex flex-col items-center">
      <svg width={w} height={h} viewBox="0 0 44 60">
        {/* clip outline */}
        <rect x="2" y="3" width="40" height="48" rx="4" fill={beer.pumpColour} stroke="rgba(0,0,0,0.18)" />
        <rect x="4" y="5" width="36" height="44" rx="3" fill="none" stroke="rgba(255,255,255,0.25)" />
        {/* lever stem */}
        <rect x="20" y="51" width="4" height="6" fill="#5a5a5a" />
        <rect x="14" y="55" width="16" height="3" rx="1" fill="#3a3a3a" />
        {/* clip text */}
        <text x="22" y="22" textAnchor="middle" fontSize={beer.name.length > 8 ? "6" : "7"} fill={beer.textColour} fontFamily="var(--font-serif)" fontWeight="700">
          {beer.name.toUpperCase()}
        </text>
        <text x="22" y="32" textAnchor="middle" fontSize="4" fill={beer.textColour} fontFamily="var(--font-serif)" opacity="0.85">
          {beer.style.toUpperCase()}
        </text>
        <text x="22" y="42" textAnchor="middle" fontSize="6" fill={beer.textColour} fontFamily="var(--font-serif)" fontWeight="700">
          {beer.abv.toFixed(1)}%
        </text>
      </svg>
      {label && <div className="text-[10px] mt-1 text-[color:var(--color-ink-soft)]">{beer.name}</div>}
    </div>
  );
}

export function FreshnessChip({ hoursAgo, beer }: { hoursAgo: number; beer: BeerSlug }) {
  const beerObj = beerBySlug(beer);
  const fresh = hoursAgo <= 4;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] hairline"
      style={{
        background: fresh ? "rgba(74, 124, 89, 0.12)" : "rgba(122, 126, 118, 0.10)",
        color: fresh ? "var(--color-success)" : "var(--color-ink-soft)",
      }}
    >
      <span className="rounded-full" style={{ width: 6, height: 6, background: fresh ? "var(--color-success)" : "var(--color-ink-mute)" }} />
      {beerObj?.name} · tapped {hoursAgo}h ago
    </span>
  );
}

export function StarRating({ value, onChange, size = 18, ariaLabel }: { value: number; onChange?: (n: number) => void; size?: number; ariaLabel?: string }) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={ariaLabel}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className="p-0.5"
          aria-label={`${n} stars`}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill={n <= value ? "var(--color-gold-deep)" : "none"} stroke="var(--color-gold-deep)" strokeWidth="1.4" strokeLinejoin="round">
            <polygon points="12,2 15,9 22,9.5 16.5,14.5 18.5,21.5 12,17.5 5.5,21.5 7.5,14.5 2,9.5 9,9" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function PrimaryButton({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-bottle)] text-[color:var(--color-cream)] font-semibold px-5 py-3 shadow-[0_8px_24px_-12px_rgba(15,36,25,0.6)] hover:bg-[color:var(--color-bottle-soft)] transition-colors disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-cream-50)] text-[color:var(--color-bottle)] font-semibold px-5 py-3 hairline hover:bg-[color:var(--color-line-soft)] transition-colors disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function GoldButton({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-gold)] text-[color:var(--color-bottle-deep)] font-semibold px-5 py-3 shadow-[0_6px_18px_-10px_rgba(163,133,61,0.7)] hover:bg-[color:var(--color-gold-soft)] transition-colors disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function BarleyDivider({ className = "" }: { className?: string }) {
  return <div className={`barley-divider ${className}`} />;
}
