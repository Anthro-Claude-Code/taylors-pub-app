"use client";
import Link from "next/link";
import { useApp, favouritePub } from "@/lib/state";
import { AppHeader } from "@/components/AppHeader";
import { BarleyCrest } from "@/components/Logo";
import { Card, Pill, PrimaryButton, GoldButton, BarleyDivider, VibePill, FreshnessChip } from "@/components/Pieces";
import { PUBS, pubById, REWARDS, levelFor, nextLevel } from "@/lib/seed";

export default function Home() {
  const { state, toggleDDMode } = useApp();
  const level = levelFor(state.pintsLogged);
  const next = nextLevel(state.pintsLogged);
  const favPub = pubById(favouritePub(state) || "fleece-haworth")!;
  const buzzing = PUBS.filter((p) => p.vibe === "buzzing" || p.vibe === "live music").slice(0, 3);
  const trending = REWARDS[0];
  const friendActivity = state.friends.find((f) => f.lastPub);
  const friendPub = friendActivity?.lastPub ? pubById(friendActivity.lastPub) : null;

  return (
    <>
      <AppHeader />
      <div className="px-4 pb-6">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[28px] mt-2 pump-clip text-[color:var(--color-cream)] p-6 pb-7" style={{ boxShadow: "var(--shadow-pump)" }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase opacity-70">Your points</p>
              <p className="text-5xl font-serif font-semibold leading-none mt-1" style={{ fontFamily: "var(--font-serif)" }}>
                {state.points.toLocaleString()}
              </p>
              <p className="text-[12px] opacity-70 mt-1">
                = £{(state.points / 1000).toFixed(2)} at any TT pub
              </p>
            </div>
            <div className="opacity-90" style={{ color: "var(--color-gold)" }}>
              <BarleyCrest size={70} withText={false} />
            </div>
          </div>
          <BarleyDivider className="my-5 opacity-60" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase opacity-70">Level</p>
              <p className="text-lg font-serif font-medium" style={{ fontFamily: "var(--font-serif)" }}>
                {level.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] tracking-[0.2em] uppercase opacity-70">Streak</p>
              <p className="text-lg font-serif font-medium flex items-center gap-1 justify-end" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="flame">🔥</span>
                {state.streakWeeks} {state.streakWeeks === 1 ? "wk" : "wks"}
              </p>
            </div>
          </div>
          {next && (
            <div className="mt-4">
              <div className="flex justify-between text-[11px] opacity-70 mb-1">
                <span>{level.name}</span>
                <span>{next.name} · {Math.max(0, next.pintsRequired - state.pintsLogged)} pints to go</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${Math.min(100, (state.pintsLogged / next.pintsRequired) * 100)}%`,
                    background: "linear-gradient(90deg, var(--color-gold), var(--color-gold-soft))",
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {/* PRIMARY CTA */}
        <Link href="/search" className="mt-5 block">
          <PrimaryButton className="w-full text-base py-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="11" r="3" />
              <path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13z" />
            </svg>
            Find a Pint
          </PrimaryButton>
        </Link>

        {/* DD MODE TOGGLE */}
        <Card className="mt-4 p-4 flex items-center gap-3">
          <div className="rounded-xl bg-[color:var(--color-bottle)]/8 w-10 h-10 flex items-center justify-center">
            <span className="text-xl">🚗</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Designated driver mode</div>
            <div className="text-xs text-[color:var(--color-ink-soft)]">Earn points on soft drinks. We&apos;ll skip the alcohol rewards.</div>
          </div>
          <button
            onClick={() => toggleDDMode()}
            aria-pressed={state.ddModeOn}
            className={`relative h-7 w-12 rounded-full transition-colors ${state.ddModeOn ? "bg-[color:var(--color-bottle)]" : "bg-[color:var(--color-line)]"}`}
          >
            <span
              className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all"
              style={{ left: state.ddModeOn ? "calc(100% - 1.625rem)" : "0.125rem" }}
            />
          </button>
        </Card>

        {/* FRIEND PROMPT */}
        {friendPub && (
          <Link href={`/search/${friendPub.id}`} className="mt-4 block">
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[color:var(--color-amber)] text-white flex items-center justify-center font-serif">{friendActivity!.initial}</div>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-semibold">{friendActivity!.name}</span> just checked in at <span className="font-semibold">{friendPub.name}</span>
                </div>
                <div className="text-xs text-[color:var(--color-ink-soft)]">Tap to see if it&apos;s busy and join</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </Card>
          </Link>
        )}

        {/* TONIGHT */}
        <h2 className="mt-6 mb-3 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Buzzing tonight near you
        </h2>
        <div className="space-y-3">
          {buzzing.map((p) => (
            <Link key={p.id} href={`/search/${p.id}`}>
              <Card className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[color:var(--color-bottle)]/10 text-[color:var(--color-bottle)] flex items-center justify-center text-2xl">
                  🍻
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-base font-semibold truncate" style={{ fontFamily: "var(--font-serif)" }}>{p.name}</div>
                  <div className="text-xs text-[color:var(--color-ink-soft)] truncate">{p.town} · {p.county}</div>
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    <VibePill vibe={p.vibe} count={p.liveCount} mini />
                    {p.caskTapped[0] && <FreshnessChip beer={p.caskTapped[0].beer} hoursAgo={p.caskTapped[0].hoursAgo} />}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Link href="/rewards">
            <Card className="p-4 h-full">
              <div className="text-2xl">🎫</div>
              <div className="font-serif font-semibold text-base mt-2" style={{ fontFamily: "var(--font-serif)" }}>Cash in your points</div>
              <div className="text-xs text-[color:var(--color-ink-soft)] mt-0.5">From {trending.cost} pts · {trending.title}</div>
            </Card>
          </Link>
          <Link href="/learn">
            <Card className="p-4 h-full">
              <div className="text-2xl">📚</div>
              <div className="font-serif font-semibold text-base mt-2" style={{ fontFamily: "var(--font-serif)" }}>Earn points learning</div>
              <div className="text-xs text-[color:var(--color-ink-soft)] mt-0.5">Quiz: cask ale · 6 questions</div>
            </Card>
          </Link>
        </div>

        {/* FAVOURITE */}
        <h2 className="mt-6 mb-3 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Your favourite
        </h2>
        <Link href={`/search/${favPub.id}`}>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-gold-deep)] font-semibold">{favPub.county}</div>
                <div className="font-serif text-xl font-semibold mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>{favPub.name}</div>
                <div className="text-sm text-[color:var(--color-ink-soft)]">{favPub.town}</div>
              </div>
              <Pill tone="gold">⭐ {favPub.rating}</Pill>
            </div>
            <div className="mt-3 text-xs text-[color:var(--color-ink-soft)]">{favPub.blurb}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {favPub.caskTapped.map((c) => (
                <FreshnessChip key={c.beer} beer={c.beer} hoursAgo={c.hoursAgo} />
              ))}
            </div>
          </Card>
        </Link>

        <p className="text-[11px] text-[color:var(--color-ink-mute)] mt-8 text-center">
          Drink responsibly. drinkaware.co.uk
        </p>
      </div>
    </>
  );
}
