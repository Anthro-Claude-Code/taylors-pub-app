"use client";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, PrimaryButton, SecondaryButton, BarleyDivider } from "@/components/Pieces";
import { useApp } from "@/lib/state";

export default function RoundMode() {
  const { state, pushNotification } = useApp();
  const [picked, setPicked] = useState<string[]>([]);
  const [pints, setPints] = useState(2);
  const [sent, setSent] = useState(false);

  const togglePicked = (n: string) => {
    setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  };

  const cost = pints * 1500;
  const perPerson = picked.length > 0 ? Math.ceil(cost / (picked.length + 1)) : cost;
  const ok = picked.length > 0 && state.points >= perPerson;

  const onSend = () => {
    if (!ok) return;
    setSent(true);
    pushNotification({
      kind: "friend",
      title: `Round request sent`,
      body: `Asked ${picked.join(", ")} to chip in ${perPerson.toLocaleString()} pts each for ${pints}× Landlord.`,
    });
  };

  return (
    <>
      <AppHeader back="/rewards" title="Round mode" subtitle="Pool points with friends to cover a round" />
      <div className="px-4 pb-6">
        <Card className="p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold">How many pints?</div>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setPints(n)}
                className={`rounded-xl py-2 text-base font-serif font-semibold ${
                  pints === n ? "bg-[color:var(--color-bottle)] text-[color:var(--color-cream)]" : "bg-white hairline"
                }`}
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {n}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4 mt-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold">Friends to split with</div>
          <div className="mt-2 grid gap-2">
            {state.friends.map((f) => (
              <button
                key={f.name}
                onClick={() => togglePicked(f.name)}
                className={`flex items-center gap-3 p-2 rounded-xl border-2 ${
                  picked.includes(f.name) ? "border-[color:var(--color-bottle)] bg-[color:var(--color-line-soft)]" : "border-transparent hairline"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[color:var(--color-amber)] text-white flex items-center justify-center font-serif">{f.initial}</div>
                <span className="text-sm font-medium">{f.name}</span>
                {picked.includes(f.name) && <span className="ml-auto text-[color:var(--color-bottle)]">✓</span>}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4 mt-4">
          <div className="flex justify-between text-sm">
            <span>Round cost</span>
            <span className="font-semibold">{cost.toLocaleString()} pts · £{(cost/1000).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Split {picked.length + 1} ways</span>
            <span className="font-semibold">{perPerson.toLocaleString()} pts each</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Your share</span>
            <span className={`font-semibold ${state.points < perPerson ? "text-[color:var(--color-danger)]" : ""}`}>
              {perPerson.toLocaleString()} pts {state.points >= perPerson ? "✓" : "(not enough)"}
            </span>
          </div>
        </Card>

        <BarleyDivider className="my-5" />

        {sent ? (
          <Card className="p-6 text-center stamp-press">
            <div className="text-6xl mb-2">🍻</div>
            <p className="font-serif text-xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>Round on the way</p>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">When everyone&apos;s confirmed, a single round voucher will be issued at the bar.</p>
          </Card>
        ) : (
          <PrimaryButton onClick={onSend} disabled={!ok} className="w-full">
            Ask {picked.length || "the gang"} to chip in
          </PrimaryButton>
        )}
      </div>
    </>
  );
}
