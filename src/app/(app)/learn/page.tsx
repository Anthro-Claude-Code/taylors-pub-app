"use client";
import Link from "next/link";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, BarleyDivider, PrimaryButton } from "@/components/Pieces";
import { Sheet } from "@/components/Sheet";
import { LEARN_CARDS, BEERS } from "@/lib/seed";
import { useApp } from "@/lib/state";
import type { LearnCard } from "@/lib/types";

export default function Learn() {
  const { state, markCardRead } = useApp();
  const [openCard, setOpenCard] = useState<LearnCard | null>(null);
  const groups = {
    cask: LEARN_CARDS.filter((c) => c.topic === "cask"),
    process: LEARN_CARDS.filter((c) => c.topic === "process"),
    heritage: LEARN_CARDS.filter((c) => c.topic === "heritage"),
    beers: LEARN_CARDS.filter((c) => c.topic === "beers"),
  };
  const readCount = state.cardsRead.length;
  const totalCards = LEARN_CARDS.length;

  return (
    <>
      <AppHeader title="Learn" subtitle="Cask, craft and the Yorkshire way." />
      <div className="px-4 pb-6">
        {/* Quizzes feature row */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/learn/cask-quiz">
            <Card className="p-4 h-full">
              <div className="text-3xl">🧠</div>
              <div className="font-serif font-semibold text-base mt-2" style={{ fontFamily: "var(--font-serif)" }}>The cask quiz</div>
              <div className="text-xs text-[color:var(--color-ink-soft)] mt-0.5">6 questions · up to 180 pts</div>
              {state.quizScores["cask"] !== undefined && (
                <Pill tone="gold" className="mt-2">Best: {state.quizScores["cask"]}/6</Pill>
              )}
            </Card>
          </Link>
          <Link href="/learn/flavour-finder">
            <Card className="p-4 h-full">
              <div className="text-3xl">🍺</div>
              <div className="font-serif font-semibold text-base mt-2" style={{ fontFamily: "var(--font-serif)" }}>Flavour finder</div>
              <div className="text-xs text-[color:var(--color-ink-soft)] mt-0.5">4 questions · find your beer</div>
            </Card>
          </Link>
        </div>

        {/* Reading progress */}
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Brand knowledge</span>
            <span className="text-[color:var(--color-ink-soft)]">{readCount}/{totalCards} read</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-[color:var(--color-line-soft)] overflow-hidden">
            <div
              className="h-full"
              style={{
                width: `${(readCount / totalCards) * 100}%`,
                background: "linear-gradient(90deg, var(--color-bottle), var(--color-bottle-soft))",
              }}
            />
          </div>
          <div className="text-xs text-[color:var(--color-ink-soft)] mt-2">25 pts per card the first time you read it.</div>
        </Card>

        <Section title="Cask & cellarmanship" cards={groups.cask} read={state.cardsRead} onOpen={setOpenCard} />
        <Section title="Our process" cards={groups.process} read={state.cardsRead} onOpen={setOpenCard} />
        <Section title="Heritage" cards={groups.heritage} read={state.cardsRead} onOpen={setOpenCard} />
        <Section title="The beer range" cards={groups.beers} read={state.cardsRead} onOpen={setOpenCard} />

        <BarleyDivider className="my-6" />

        {/* Brewery tour CTA */}
        <Link href="/learn/brewery-tour">
          <Card className="p-5 bg-[color:var(--color-bottle)] text-[color:var(--color-cream)]">
            <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--color-gold)" }}>The real thing</div>
            <div className="font-serif text-xl font-semibold mt-1" style={{ fontFamily: "var(--font-serif)" }}>Book a brewery tour</div>
            <p className="text-sm opacity-90 mt-1">Behind the scenes at Knowle Spring with the brewing team. Tasting included.</p>
            <Pill tone="gold" className="mt-3">From £18 · Saturdays</Pill>
          </Card>
        </Link>

        {/* Beer index quick link */}
        <h2 className="mt-6 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>The full range</h2>
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {BEERS.map((b) => (
              <div key={b.slug} className="flex items-center justify-between border-b border-dashed border-[color:var(--color-line-soft)] py-1.5">
                <span className="font-semibold">{b.name}</span>
                <span className="text-[color:var(--color-ink-soft)]">{b.abv}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Sheet open={!!openCard} onClose={() => setOpenCard(null)} title={openCard?.title}>
        {openCard && (
          <CardReader
            card={openCard}
            already={state.cardsRead.includes(openCard.id)}
            markRead={() => {
              markCardRead(openCard.id);
            }}
            close={() => setOpenCard(null)}
          />
        )}
      </Sheet>
    </>
  );
}

function Section({ title, cards, read, onOpen }: { title: string; cards: LearnCard[]; read: string[]; onOpen: (c: LearnCard) => void }) {
  return (
    <>
      <h2 className="mt-6 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>{title}</h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
        {cards.map((c) => {
          const isRead = read.includes(c.id);
          return (
            <button key={c.id} onClick={() => onOpen(c)} className="shrink-0 w-60 text-left">
              <Card className="p-4 h-full">
                <div className="flex items-center justify-between">
                  <Pill tone={isRead ? "neutral" : "gold"}>{isRead ? "Read" : `+${c.pointsOnRead} pts`}</Pill>
                </div>
                <div className="font-serif text-base font-semibold mt-2 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{c.title}</div>
                <p className="text-xs text-[color:var(--color-ink-soft)] mt-1 line-clamp-3">{c.body.slice(0, 90)}…</p>
              </Card>
            </button>
          );
        })}
      </div>
    </>
  );
}

function CardReader({ card, already, markRead, close }: { card: LearnCard; already: boolean; markRead: () => void; close: () => void }) {
  return (
    <div>
      <p className="text-base leading-relaxed">{card.body}</p>
      <BarleyDivider className="my-5" />
      {already ? (
        <div className="text-sm text-[color:var(--color-ink-soft)] text-center">Already read · pts banked.</div>
      ) : (
        <PrimaryButton className="w-full" onClick={() => { markRead(); close(); }}>
          Got it · +{card.pointsOnRead} pts
        </PrimaryButton>
      )}
    </div>
  );
}
