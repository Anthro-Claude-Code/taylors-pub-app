"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, BarleyDivider, BeerPump, StarRating, PrimaryButton, SecondaryButton } from "@/components/Pieces";
import { Sheet } from "@/components/Sheet";
import { useApp, favouriteBeer, favouritePub, beerName } from "@/lib/state";
import { pubById, beerBySlug, levelFor, nextLevel, PUBS, BEERS, TRAILS } from "@/lib/seed";
import { BADGES } from "@/lib/badges";
import type { PassportEntry } from "@/lib/types";

export default function PassportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[color:var(--color-ink-soft)]">Loading…</div>}>
      <Passport />
    </Suspense>
  );
}

function Passport() {
  const { state } = useApp();
  const search = useSearchParams();
  const justStamped = search.get("just-stamped") === "1";
  const [openEntry, setOpenEntry] = useState<PassportEntry | null>(null);
  const [shareEntry, setShareEntry] = useState<PassportEntry | null>(null);

  const level = levelFor(state.pintsLogged);
  const next = nextLevel(state.pintsLogged);

  const favBeerSlug = favouriteBeer(state);
  const favBeer = favBeerSlug ? beerBySlug(favBeerSlug) : null;
  const favPubId = favouritePub(state);
  const favPub = favPubId ? pubById(favPubId) : null;

  const earnedIds = state.badgesEarned;
  const allBadges = BADGES;

  const trailProgress = TRAILS.map((t) => ({
    trail: t,
    visited: t.pubIds.filter((id) => state.pubsVisited.includes(id)),
  }));

  return (
    <>
      <AppHeader title="Passport" subtitle={`${state.pintsLogged} pint${state.pintsLogged === 1 ? "" : "s"} · ${state.pubsVisited.length} pub${state.pubsVisited.length === 1 ? "" : "s"} · ${state.beersTried.length}/7 beers`} />
      <div className="px-4 pb-6">
        {/* Hero passport book */}
        <div className="rounded-3xl bg-[color:var(--color-bottle)] text-[color:var(--color-cream)] p-5 relative overflow-hidden" style={{ boxShadow: "var(--shadow-pump)" }}>
          <div className="absolute -top-6 -right-6 opacity-15 text-[180px]">📔</div>
          <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--color-gold)" }}>Beer passport</div>
          <h2 className="font-serif text-2xl font-semibold leading-tight mt-1" style={{ fontFamily: "var(--font-serif)" }}>
            {state.name || "Friend"}&apos;s passport
          </h2>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">Level</div>
              <div className="font-serif text-base font-semibold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{level.name}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">Streak</div>
              <div className="font-serif text-base font-semibold leading-tight flex items-center gap-1" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="flame">🔥</span>{state.streakWeeks} wk
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">Badges</div>
              <div className="font-serif text-base font-semibold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{earnedIds.length}/{allBadges.length}</div>
            </div>
          </div>

          {next && (
            <div className="mt-4">
              <div className="flex justify-between text-[11px] opacity-80 mb-1">
                <span>{state.pintsLogged} pints</span>
                <span>{next.pintsRequired - state.pintsLogged} more to {next.name}</span>
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
        </div>

        {justStamped && (
          <Card className="mt-4 p-4 text-center stamp-press border-2 border-[color:var(--color-gold)]">
            <div className="text-3xl">📝</div>
            <p className="font-serif text-lg font-semibold mt-1" style={{ fontFamily: "var(--font-serif)" }}>Stamped</p>
            <p className="text-xs text-[color:var(--color-ink-soft)]">+50 pts. Saved to your passport.</p>
          </Card>
        )}

        {/* Stats trio */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Card className="p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] font-semibold">Favourite beer</div>
            {favBeer ? (
              <div className="mt-2 flex items-center gap-3">
                <BeerPump slug={favBeer.slug} size={42} />
                <div>
                  <div className="font-serif text-base font-semibold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{favBeer.name}</div>
                  <div className="text-xs text-[color:var(--color-ink-soft)]">{favBeer.style}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-[color:var(--color-ink-soft)] mt-2">Stamp a few visits to see this.</div>
            )}
          </Card>
          <Card className="p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] font-semibold">Favourite pub</div>
            {favPub ? (
              <Link href={`/search/${favPub.id}`}>
                <div className="font-serif text-base font-semibold mt-2 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{favPub.name}</div>
                <div className="text-xs text-[color:var(--color-ink-soft)]">{favPub.town}</div>
              </Link>
            ) : (
              <div className="text-sm text-[color:var(--color-ink-soft)] mt-2">Stamp a few visits to see this.</div>
            )}
          </Card>
        </div>

        {/* Beer collection */}
        <h2 className="mt-6 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>Beer collection</h2>
        <Card className="p-4">
          <div className="grid grid-cols-4 gap-2">
            {BEERS.map((b) => {
              const tried = state.beersTried.includes(b.slug);
              return (
                <div key={b.slug} className={`flex flex-col items-center gap-1 ${!tried ? "opacity-25 grayscale" : ""}`}>
                  <BeerPump slug={b.slug} size={42} />
                  <div className="text-[10px] text-center leading-tight">{b.name}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Badges */}
        <h2 className="mt-6 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>Badges</h2>
        <div className="grid grid-cols-3 gap-3">
          {allBadges.map((b) => {
            const earned = earnedIds.includes(b.id);
            return (
              <Card key={b.id} className={`p-3 text-center ${!earned ? "opacity-50" : ""}`}>
                <div className="text-3xl">{earned ? b.icon : "🔒"}</div>
                <div className="text-[11px] font-semibold mt-1 leading-tight">{b.name}</div>
                <div className="text-[10px] text-[color:var(--color-ink-soft)] mt-0.5 leading-tight">{b.description}</div>
              </Card>
            );
          })}
        </div>

        {/* Trails */}
        <h2 className="mt-6 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>Trails</h2>
        {trailProgress.map(({ trail, visited }) => (
          <Card key={trail.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-serif text-base font-semibold" style={{ fontFamily: "var(--font-serif)" }}>{trail.name}</div>
                <div className="text-xs text-[color:var(--color-ink-soft)]">{visited.length}/{trail.pubIds.length} pubs visited</div>
              </div>
              <div className="text-2xl">{trail.image}</div>
            </div>
            <div className="mt-3 flex gap-2">
              {trail.pubIds.map((id) => {
                const stamped = visited.includes(id);
                const pub = pubById(id);
                return (
                  <Link key={id} href={`/search/${id}`} className="flex-1">
                    <div
                      className={`rounded-xl border-2 p-2 text-center text-[10px] leading-tight ${
                        stamped
                          ? "border-[color:var(--color-bottle)] bg-[color:var(--color-line-soft)] text-[color:var(--color-bottle)]"
                          : "border-dashed border-[color:var(--color-line)] text-[color:var(--color-ink-mute)]"
                      }`}
                    >
                      <div className="text-base">{stamped ? "✓" : "○"}</div>
                      <div className="font-semibold truncate">{pub?.name.replace(/^The /, "")}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        ))}

        {/* Recent activity */}
        <h2 className="mt-6 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>Stamped visits</h2>
        {state.passport.length === 0 ? (
          <Card className="p-6 text-center text-sm text-[color:var(--color-ink-soft)]">
            No stamps yet. Check in at a pub and add your first one.
          </Card>
        ) : (
          <div className="space-y-3">
            {state.passport.map((e) => (
              <PassportRow key={e.id} entry={e} onOpen={() => setOpenEntry(e)} onShare={() => setShareEntry(e)} />
            ))}
          </div>
        )}

        <BarleyDivider className="my-6" />
        <p className="text-[11px] text-[color:var(--color-ink-mute)] text-center">
          Drink responsibly. drinkaware.co.uk
        </p>
      </div>

      <Sheet open={!!openEntry} onClose={() => setOpenEntry(null)} title={openEntry ? new Date(openEntry.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}>
        {openEntry && <EntryDetail entry={openEntry} onShare={() => { setShareEntry(openEntry); setOpenEntry(null); }} />}
      </Sheet>

      <Sheet open={!!shareEntry} onClose={() => setShareEntry(null)} title="Share this stamp">
        {shareEntry && <ShareableStamp entry={shareEntry} />}
      </Sheet>
    </>
  );
}

function PassportRow({ entry, onOpen, onShare }: { entry: PassportEntry; onOpen: () => void; onShare: () => void }) {
  const pub = pubById(entry.pubId);
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <button onClick={onOpen} className="shrink-0">
          <div className="w-14 h-14 rounded-full border-2 border-[color:var(--color-bottle)] flex items-center justify-center bg-[color:var(--color-cream-50)] stamp-press"
               style={{ transform: "rotate(-3deg)" }}>
            <div className="text-center text-[8px] leading-tight font-serif uppercase tracking-wider text-[color:var(--color-bottle)]" style={{ fontFamily: "var(--font-serif)" }}>
              <div>TT</div>
              <div className="text-[7px]">{new Date(entry.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
            </div>
          </div>
        </button>
        <div className="flex-1 min-w-0" onClick={onOpen} role="button">
          <div className="font-serif text-base font-semibold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{pub?.name}</div>
          <div className="text-xs text-[color:var(--color-ink-soft)]">{pub?.town} · {beerName(entry.beer)}</div>
          <div className="mt-1 flex items-center gap-2">
            <StarRating value={entry.pintRating} size={12} />
            {entry.ddMode && <Pill tone="neutral" className="text-[9px]">DD</Pill>}
          </div>
          {entry.note && <p className="text-xs text-[color:var(--color-ink-soft)] italic mt-1.5 line-clamp-2">&ldquo;{entry.note}&rdquo;</p>}
        </div>
        <button onClick={onShare} className="rounded-full p-2 hover:bg-[color:var(--color-line-soft)]" aria-label="Share stamp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
            <path d="M16 6l-4-4-4 4" />
            <path d="M12 2v14" />
          </svg>
        </button>
      </div>
    </Card>
  );
}

function EntryDetail({ entry, onShare }: { entry: PassportEntry; onShare: () => void }) {
  const pub = pubById(entry.pubId);
  const beer = beerBySlug(entry.beer);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <BeerPump slug={entry.beer} size={56} />
        <div>
          <div className="font-serif text-lg font-semibold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{pub?.name}</div>
          <div className="text-xs text-[color:var(--color-ink-soft)]">{pub?.town} · {beer?.style}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold">Pint</div>
          <div className="mt-1"><StarRating value={entry.pintRating} size={16} /></div>
        </Card>
        <Card className="p-3">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold">Service</div>
          <div className="mt-1"><StarRating value={entry.serviceRating} size={16} /></div>
        </Card>
      </div>
      {entry.note && (
        <Card className="p-4 bg-[color:var(--color-cream-50)]">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold mb-1">Note</div>
          <p className="text-sm italic">&ldquo;{entry.note}&rdquo;</p>
        </Card>
      )}
      <PrimaryButton className="w-full" onClick={onShare}>
        Share this stamp
      </PrimaryButton>
    </div>
  );
}

function ShareableStamp({ entry }: { entry: PassportEntry }) {
  const pub = pubById(entry.pubId);
  const beer = beerBySlug(entry.beer);
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    if (!ref.current) return;
    const svg = ref.current.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tt-stamp-${entry.id}.svg`;
    a.click();
    setCopied(true);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div>
      <div ref={ref} className="flex justify-center">
        <svg viewBox="0 0 360 540" width="280" height="420" style={{ borderRadius: 16 }}>
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e4538" />
              <stop offset="100%" stopColor="#0f2419" />
            </linearGradient>
            <radialGradient id="grain" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(201,169,97,0.15)" />
              <stop offset="100%" stopColor="rgba(201,169,97,0)" />
            </radialGradient>
          </defs>
          <rect width="360" height="540" fill="url(#bg)" />
          <rect width="360" height="540" fill="url(#grain)" />
          <rect x="20" y="20" width="320" height="500" fill="none" stroke="#c9a961" strokeWidth="1.5" strokeOpacity="0.6" rx="8" />
          {/* Top label */}
          <text x="180" y="60" textAnchor="middle" fill="#c9a961" fontFamily="var(--font-serif)" fontSize="11" letterSpacing="4">
            TIMOTHY TAYLOR&apos;S
          </text>
          <text x="180" y="78" textAnchor="middle" fill="#c9a961" fontFamily="var(--font-serif)" fontSize="9" letterSpacing="3" opacity="0.7">
            BEER PASSPORT · EST 1858
          </text>
          {/* Stamp */}
          <g transform="translate(180 180) rotate(-8)">
            <circle r="72" fill="none" stroke="#c9a961" strokeWidth="3" strokeDasharray="2 4" opacity="0.7" />
            <circle r="60" fill="none" stroke="#c9a961" strokeWidth="2" />
            <text textAnchor="middle" y="-22" fill="#c9a961" fontSize="9" fontFamily="var(--font-serif)" letterSpacing="2">
              STAMPED
            </text>
            <text textAnchor="middle" y="-2" fill="#f5ecd7" fontSize="14" fontFamily="var(--font-serif)" fontWeight="700">
              {pub?.town?.toUpperCase().slice(0, 14)}
            </text>
            <text textAnchor="middle" y="18" fill="#c9a961" fontSize="9" fontFamily="var(--font-serif)" letterSpacing="2">
              {new Date(entry.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()}
            </text>
          </g>
          {/* Pub & beer */}
          <text x="180" y="320" textAnchor="middle" fill="#f5ecd7" fontFamily="var(--font-serif)" fontSize="22" fontWeight="700">
            {(pub?.name || "").slice(0, 24)}
          </text>
          <text x="180" y="346" textAnchor="middle" fill="#c9a961" fontFamily="var(--font-serif)" fontSize="14" fontStyle="italic">
            {beer?.name} · {beer?.style}
          </text>
          {/* Stars */}
          <g transform="translate(180 380)">
            {[-2, -1, 0, 1, 2].map((i) => (
              <polygon
                key={i}
                points="0,-9 2.7,-2.7 9,-2.7 4,1.5 6,9 0,4 -6,9 -4,1.5 -9,-2.7 -2.7,-2.7"
                fill={i + 3 <= entry.pintRating ? "#c9a961" : "none"}
                stroke="#c9a961"
                strokeWidth="1.4"
                transform={`translate(${i * 22} 0)`}
              />
            ))}
          </g>
          {entry.note && (
            <text x="180" y="430" textAnchor="middle" fill="#f5ecd7" fontFamily="var(--font-serif)" fontSize="12" fontStyle="italic" opacity="0.9">
              &ldquo;{entry.note.slice(0, 50)}&rdquo;
            </text>
          )}
          {/* Bottom */}
          <text x="180" y="510" textAnchor="middle" fill="#c9a961" fontSize="9" fontFamily="var(--font-serif)" letterSpacing="3" opacity="0.6">
            DRINK RESPONSIBLY · DRINKAWARE.CO.UK
          </text>
        </svg>
      </div>
      <p className="text-xs text-[color:var(--color-ink-soft)] text-center mt-3">A keepsake. Save it for the gram, send it to mates.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <SecondaryButton onClick={onCopy}>{copied ? "Saved" : "Save image"}</SecondaryButton>
        <PrimaryButton onClick={() => navigator.clipboard?.writeText(`Just stamped ${pub?.name} in my Timothy Taylor's passport. ${beer?.name} hit the spot.`).then(() => setCopied(true)).catch(() => {})}>
          Copy text
        </PrimaryButton>
      </div>
    </div>
  );
}
