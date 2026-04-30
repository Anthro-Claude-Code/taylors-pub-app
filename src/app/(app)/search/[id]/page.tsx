"use client";
import { use, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, PrimaryButton, SecondaryButton, FreshnessChip, VibePill, BeerPump, StarRating, BarleyDivider } from "@/components/Pieces";
import { Sheet } from "@/components/Sheet";
import { pubById, beerBySlug, REWARDS } from "@/lib/seed";
import { useApp, beerName } from "@/lib/state";
import { notFound, useRouter } from "next/navigation";
import type { BeerSlug } from "@/lib/types";

export default function PubDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pub = pubById(id);
  const router = useRouter();
  const { state, checkIn, logPassportEntry, pushNotification } = useApp();
  const [checkingIn, setCheckingIn] = useState(false);
  const [stamping, setStamping] = useState(false);
  const [chosenBeer, setChosenBeer] = useState<BeerSlug | null>(null);
  const [pintRating, setPintRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState<{ points: number; alreadyToday: boolean } | null>(null);

  if (!pub) return notFound();

  const friendsHere = state.friends.filter((f) => f.lastPub === pub.id);
  const myEntries = state.passport.filter((e) => e.pubId === pub.id);
  const eligibleRewards = REWARDS.filter(
    (r) => !r.pubScope || r.pubScope.includes(pub.id),
  ).slice(0, 3);

  const onCheckIn = () => {
    const result = checkIn(pub.id, { ddMode: state.ddModeOn });
    setConfirmed(result);
    setCheckingIn(true);
    if (!result.alreadyToday) {
      pushNotification({
        kind: "system",
        title: `Checked in at ${pub.name}`,
        body: `+${result.points} points. ${state.ddModeOn ? "DD mode — soft drink reward eligible." : "Stamp your Passport for +50 more."}`,
      });
    }
  };

  const onStamp = () => {
    if (!chosenBeer) return;
    logPassportEntry({
      pubId: pub.id,
      beer: chosenBeer,
      pintRating,
      serviceRating,
      note: note.trim() || undefined,
      ddMode: state.ddModeOn,
    });
    setStamping(false);
    setChosenBeer(null);
    setNote("");
    router.push("/passport?just-stamped=1");
  };

  return (
    <>
      <AppHeader back="/search" />
      {/* Hero */}
      <div className="px-4">
        <div className="relative rounded-3xl overflow-hidden h-44 pump-clip text-[color:var(--color-cream)] flex items-end p-5">
          <div className="absolute inset-0 opacity-15 flex items-center justify-center text-[140px]">🍻</div>
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.22em] opacity-85" style={{ color: "var(--color-gold)" }}>{pub.county}</div>
            <h1 className="text-2xl font-serif font-semibold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{pub.name}</h1>
            <p className="text-xs opacity-80 mt-0.5">{pub.address}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-4 flex gap-2">
          <PrimaryButton onClick={onCheckIn} className="flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12l4 4L19 6" /></svg>
            Check in here
          </PrimaryButton>
          <a
            href={`https://maps.apple.com/?q=${encodeURIComponent(pub.name + " " + pub.postcode)}`}
            target="_blank"
            rel="noreferrer"
          >
            <SecondaryButton>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-6 9 6v12H3z"/><path d="M9 21V12h6v9"/></svg>
              Directions
            </SecondaryButton>
          </a>
        </div>

        {/* Right now strip */}
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold">Right now</div>
              <div className="mt-1.5 flex items-center gap-2">
                <VibePill vibe={pub.vibe} count={pub.liveCount} />
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold">Today</div>
              <div className="text-sm mt-1.5">{pub.hoursToday}</div>
            </div>
          </div>
          {friendsHere.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[color:var(--color-line-soft)] flex items-center gap-2">
              <div className="flex -space-x-2">
                {friendsHere.map((f) => (
                  <div key={f.name} className="w-7 h-7 rounded-full bg-[color:var(--color-amber)] text-white flex items-center justify-center text-xs font-serif border-2 border-[color:var(--color-paper)]">{f.initial}</div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">{friendsHere.map((f) => f.name).join(", ")}</span> {friendsHere.length === 1 ? "is" : "are"} here
              </div>
            </div>
          )}
        </Card>

        {/* Cask freshness */}
        <h2 className="mt-5 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          On the bar
        </h2>
        <Card className="p-4">
          <div className="text-xs text-[color:var(--color-ink-soft)] mb-3">
            Live cask freshness — when each cask was tapped at this pub.
          </div>
          <div className="flex flex-col gap-2">
            {pub.caskTapped.map((c) => (
              <div key={c.beer} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BeerPump slug={c.beer} size={36} />
                  <div>
                    <div className="text-sm font-semibold">{beerName(c.beer)}</div>
                    <div className="text-xs text-[color:var(--color-ink-soft)]">
                      {beerBySlug(c.beer)?.style} · {beerBySlug(c.beer)?.abv}%
                    </div>
                  </div>
                </div>
                <FreshnessChip beer={c.beer} hoursAgo={c.hoursAgo} />
              </div>
            ))}
            <div className="text-xs text-[color:var(--color-ink-soft)] mt-1 pt-2 border-t border-[color:var(--color-line-soft)]">
              Plus: {pub.beers.filter((b) => !pub.caskTapped.some((c) => c.beer === b)).map((b) => beerName(b)).join(", ") || "—"}
            </div>
          </div>
        </Card>

        {/* About */}
        <h2 className="mt-5 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          About
        </h2>
        <Card className="p-4">
          <p className="text-sm leading-relaxed">{pub.blurb}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pub.features.map((f) => (
              <Pill key={f}>{f}</Pill>
            ))}
          </div>
          {pub.phone && (
            <div className="mt-3 pt-3 border-t border-[color:var(--color-line-soft)] flex items-center justify-between text-sm">
              <span className="text-[color:var(--color-ink-soft)]">Phone</span>
              <a href={`tel:${pub.phone}`} className="font-semibold text-[color:var(--color-bottle)]">{pub.phone}</a>
            </div>
          )}
        </Card>

        {/* Rewards available here */}
        <h2 className="mt-5 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Rewards you can use here
        </h2>
        <div className="space-y-2">
          {eligibleRewards.map((r) => (
            <Link key={r.id} href={`/rewards/${r.id}`}>
              <Card className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[color:var(--color-gold-soft)] flex items-center justify-center text-lg">🎫</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{r.title}</div>
                  <div className="text-xs text-[color:var(--color-ink-soft)] truncate">{r.subtitle}</div>
                </div>
                <span className="text-[color:var(--color-ink-mute)]">›</span>
              </Card>
            </Link>
          ))}
        </div>

        {/* My visits */}
        {myEntries.length > 0 && (
          <>
            <h2 className="mt-5 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
              Your visits
            </h2>
            <Card className="p-4 space-y-3">
              {myEntries.slice(0, 3).map((e) => (
                <div key={e.id} className="flex items-start gap-3">
                  <BeerPump slug={e.beer} size={32} />
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-semibold">{beerName(e.beer)}</span>
                      <span className="text-[color:var(--color-ink-soft)]"> · {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <StarRating value={e.pintRating} size={12} />
                    </div>
                    {e.note && <p className="text-xs text-[color:var(--color-ink-soft)] mt-1 italic">&ldquo;{e.note}&rdquo;</p>}
                  </div>
                </div>
              ))}
            </Card>
          </>
        )}

        <BarleyDivider className="my-6" />
        <div className="text-center pb-4">
          <button onClick={() => setStamping(true)} className="text-sm text-[color:var(--color-gold-deep)] font-semibold underline-offset-4 hover:underline">
            + Stamp this visit in your Passport
          </button>
        </div>
      </div>

      {/* Check-in confirmation sheet */}
      <Sheet open={checkingIn} onClose={() => setCheckingIn(false)} title="Checked in">
        {confirmed?.alreadyToday ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">😅</div>
            <p className="text-base">You&apos;ve already checked in here today. We&apos;ll save you the points for next time.</p>
          </div>
        ) : (
          <div className="text-center py-4 stamp-press">
            <div className="text-6xl mb-2">🍺</div>
            <p className="text-3xl font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>+{confirmed?.points} pts</p>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">Welcome to {pub.name}.</p>
            <div className="mt-5 flex flex-col gap-2">
              <PrimaryButton onClick={() => { setCheckingIn(false); setStamping(true); }}>
                Stamp my passport
              </PrimaryButton>
              <SecondaryButton onClick={() => setCheckingIn(false)}>Maybe later</SecondaryButton>
            </div>
          </div>
        )}
      </Sheet>

      {/* Stamp passport sheet */}
      <Sheet open={stamping} onClose={() => setStamping(false)} title="Stamp your passport">
        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold mb-2">
              What did you have?
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-2">
              {pub.beers.map((b) => (
                <button
                  key={b}
                  onClick={() => setChosenBeer(b)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 ${
                    chosenBeer === b ? "border-[color:var(--color-bottle)] bg-[color:var(--color-line-soft)]" : "border-transparent"
                  }`}
                >
                  <BeerPump slug={b} size={40} />
                  <span className="text-[10px]">{beerBySlug(b)?.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold mb-1">
              Pint
            </div>
            <StarRating value={pintRating} onChange={setPintRating} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold mb-1">
              Service
            </div>
            <StarRating value={serviceRating} onChange={setServiceRating} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold mb-1">
              Note (optional)
            </div>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything memorable about tonight?"
              className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-bottle)]"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <SecondaryButton onClick={() => setStamping(false)} className="flex-1">Cancel</SecondaryButton>
            <PrimaryButton onClick={onStamp} disabled={!chosenBeer} className="flex-1">+50 pts · Stamp</PrimaryButton>
          </div>
        </div>
      </Sheet>
    </>
  );
}
