"use client";
import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, PrimaryButton, SecondaryButton, BarleyDivider } from "@/components/Pieces";

const SLOTS = [
  { date: "Sat 3 May", time: "11:00", spaces: 4 },
  { date: "Sat 3 May", time: "14:00", spaces: 0 },
  { date: "Sat 10 May", time: "11:00", spaces: 6 },
  { date: "Sat 10 May", time: "14:00", spaces: 3 },
  { date: "Sat 17 May", time: "11:00", spaces: 8 },
];

export default function BreweryTour() {
  const [picked, setPicked] = useState<number | null>(null);
  const [people, setPeople] = useState(2);
  const [booked, setBooked] = useState(false);

  return (
    <>
      <AppHeader back="/learn" />
      <div className="px-4 pb-6">
        <div className="rounded-3xl pump-clip text-[color:var(--color-cream)] p-6 relative overflow-hidden">
          <div className="absolute right-3 top-3 text-7xl opacity-25">🏛️</div>
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--color-gold)" }}>Knowle Spring brewery</div>
            <h1 className="font-serif text-2xl font-semibold mt-1" style={{ fontFamily: "var(--font-serif)" }}>Behind the scenes</h1>
            <p className="text-sm opacity-90 mt-1">90 minutes with the brewing team. Mash tun, fermenter, and a four-beer tasting in the brewery tap.</p>
          </div>
        </div>

        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between text-sm">
            <span>Adult ticket</span>
            <span className="font-semibold">£18 · 2,000 pts</span>
          </div>
          <div className="text-xs text-[color:var(--color-ink-soft)] mt-1">Ticket includes 4 × 1/3 pint tasters and a Timothy Taylor&apos;s pint glass to take home.</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Pill tone="gold">90 minutes</Pill>
            <Pill tone="neutral">18+</Pill>
            <Pill tone="amber">Includes glass</Pill>
          </div>
        </Card>

        <h2 className="mt-5 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>Pick a slot</h2>
        <div className="space-y-2">
          {SLOTS.map((s, i) => (
            <button
              key={i}
              disabled={s.spaces === 0}
              onClick={() => setPicked(i)}
              className={`w-full rounded-xl border-2 p-3 flex items-center justify-between text-left ${
                picked === i
                  ? "border-[color:var(--color-bottle)] bg-[color:var(--color-line-soft)]"
                  : s.spaces === 0
                  ? "border-[color:var(--color-line)] opacity-50"
                  : "border-[color:var(--color-line)] bg-white"
              }`}
            >
              <div>
                <div className="text-sm font-semibold">{s.date} · {s.time}</div>
                <div className="text-xs text-[color:var(--color-ink-soft)]">{s.spaces} space{s.spaces === 1 ? "" : "s"} left</div>
              </div>
              {picked === i && <span className="text-[color:var(--color-bottle)]">✓</span>}
              {s.spaces === 0 && <span className="text-xs text-[color:var(--color-danger)]">Sold out</span>}
            </button>
          ))}
        </div>

        <h2 className="mt-5 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>How many?</h2>
        <Card className="p-4 flex items-center justify-between">
          <span className="text-sm">Adults</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-8 h-8 rounded-full bg-[color:var(--color-line-soft)] font-semibold">−</button>
            <span className="w-6 text-center font-semibold">{people}</span>
            <button onClick={() => setPeople(Math.min(8, people + 1))} className="w-8 h-8 rounded-full bg-[color:var(--color-line-soft)] font-semibold">+</button>
          </div>
        </Card>

        <BarleyDivider className="my-6" />

        {booked ? (
          <Card className="p-6 text-center stamp-press">
            <div className="text-6xl mb-2">🎟️</div>
            <p className="font-serif text-xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>Booking received</p>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">A confirmation will appear in your wallet shortly.</p>
            <Link href="/learn" className="block mt-5">
              <PrimaryButton className="w-full">Done</PrimaryButton>
            </Link>
          </Card>
        ) : (
          <PrimaryButton onClick={() => picked !== null && setBooked(true)} disabled={picked === null} className="w-full">
            Book {people} ticket{people === 1 ? "" : "s"} · £{people * 18}
          </PrimaryButton>
        )}
      </div>
    </>
  );
}
