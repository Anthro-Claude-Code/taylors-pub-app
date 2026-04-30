"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, VibePill, FreshnessChip } from "@/components/Pieces";
import { PUBS, TRAILS } from "@/lib/seed";
import type { Pub } from "@/lib/types";

export default function Search() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let items: Pub[] = PUBS;
    if (filter === "yorkshire") items = items.filter((p) => p.county.includes("Yorkshire"));
    if (filter === "near") items = items.slice(0, 6); // dummy "near me"
    if (filter === "open-late") items = items.filter((p) => p.hoursToday.endsWith("00:00") || p.hoursToday.endsWith("23:30"));
    if (filter === "live") items = items.filter((p) => p.vibe === "live music");
    if (filter === "food") items = items.filter((p) => p.features.some((f) => /food|bistro|dining|restaurant|brunch|tasting/i.test(f)));
    if (filter === "rooms") items = items.filter((p) => p.features.some((f) => /Room/i.test(f)));
    if (filter === "trail") items = items.filter((p) => p.trail);
    if (q.trim()) {
      const Q = q.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(Q) ||
          p.town.toLowerCase().includes(Q) ||
          p.county.toLowerCase().includes(Q) ||
          p.postcode.toLowerCase().includes(Q),
      );
    }
    return items;
  }, [q, filter]);

  return (
    <>
      <AppHeader title="Find a pint" subtitle={`${PUBS.length} TT pubs across Yorkshire & beyond`} />
      <div className="px-4">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pub name, town or postcode"
            className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white pl-11 pr-4 py-3.5 text-base focus:outline-none focus:border-[color:var(--color-bottle)]"
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-ink-mute)]">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4-4" />
          </svg>
        </div>

        {/* Filter chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { k: "all", label: "All" },
            { k: "near", label: "Near me" },
            { k: "yorkshire", label: "Yorkshire" },
            { k: "open-late", label: "Open late" },
            { k: "food", label: "Food" },
            { k: "rooms", label: "With rooms" },
            { k: "live", label: "Live music" },
            { k: "trail", label: "On a trail" },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm border ${
                filter === f.k
                  ? "bg-[color:var(--color-bottle)] text-[color:var(--color-cream)] border-[color:var(--color-bottle)]"
                  : "bg-white border-[color:var(--color-line)] text-[color:var(--color-ink)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Trail spotlight */}
        {filter === "all" && q === "" && (
          <Link href="/trails/bronte-and-rails" className="mt-4 block">
            <div className="rounded-2xl p-4 bg-gradient-to-br from-[color:var(--color-amber)] to-[color:var(--color-amber-soft)] text-white relative overflow-hidden">
              <div className="absolute top-2 right-3 text-4xl opacity-30">🚂</div>
              <div className="text-[11px] uppercase tracking-[0.18em] opacity-90">Featured trail</div>
              <div className="font-serif text-lg font-semibold mt-1" style={{ fontFamily: "var(--font-serif)" }}>
                Brontë & Rails
              </div>
              <div className="text-sm opacity-95">Four pubs along the Worth Valley line. Free Landlord at the finish.</div>
            </div>
          </Link>
        )}

        <div className="mt-4 space-y-3 pb-4">
          {filtered.map((p) => (
            <PubResult key={p.id} pub={p} />
          ))}
          {filtered.length === 0 && (
            <Card className="p-6 text-center text-sm text-[color:var(--color-ink-soft)]">
              No pubs match. Try a different filter or search term.
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

function PubResult({ pub }: { pub: Pub }) {
  return (
    <Link href={`/search/${pub.id}`}>
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-[color:var(--color-bottle)]/8 flex items-center justify-center text-3xl" aria-hidden>
            {pub.vibe === "live music" ? "🎶" : pub.features.some((f) => /Walker|moor|view|hilltop/i.test(f)) ? "⛰️" : pub.features.some((f) => /Canal|river/i.test(f)) ? "🌊" : pub.features.some((f) => /Brewery|heritage/i.test(f)) ? "🏛️" : "🍻"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-serif text-[17px] font-semibold leading-tight truncate" style={{ fontFamily: "var(--font-serif)" }}>{pub.name}</div>
                <div className="text-xs text-[color:var(--color-ink-soft)] truncate">{pub.town} · {pub.county} · {pub.postcode}</div>
              </div>
              <Pill tone="gold">⭐ {pub.rating}</Pill>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <VibePill vibe={pub.vibe} count={pub.liveCount} mini />
              {pub.caskTapped[0] && <FreshnessChip beer={pub.caskTapped[0].beer} hoursAgo={pub.caskTapped[0].hoursAgo} />}
              {pub.trail && <Pill tone="amber" className="text-[10px] py-0.5">🚂 Trail pub</Pill>}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
