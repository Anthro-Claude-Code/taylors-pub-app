"use client";
import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, PrimaryButton, BarleyDivider } from "@/components/Pieces";
import { BeerPump } from "@/components/Pieces";
import { FLAVOUR_QUIZ, beerBySlug, PUBS } from "@/lib/seed";
import { useApp, recommendBeerForFlavour } from "@/lib/state";
import type { FlavourTag } from "@/lib/types";

export default function FlavourFinder() {
  const { setFlavourPrefs } = useApp();
  const [step, setStep] = useState(0);
  const [tags, setTags] = useState<FlavourTag[]>([]);
  const [done, setDone] = useState(false);

  const choose = (newTags: FlavourTag[]) => {
    const accumulated = [...tags, ...newTags];
    if (step < FLAVOUR_QUIZ.length - 1) {
      setTags(accumulated);
      setStep(step + 1);
    } else {
      setTags(accumulated);
      setFlavourPrefs(accumulated);
      setDone(true);
    }
  };

  if (done) {
    const recSlug = recommendBeerForFlavour(tags);
    const beer = beerBySlug(recSlug);
    if (!beer) return null;
    const stockingPubs = PUBS.filter((p) => p.beers.includes(beer.slug)).slice(0, 3);

    return (
      <>
        <AppHeader back="/learn" />
        <div className="px-4 pb-6">
          <Card className="p-6 text-center">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-gold-deep)] font-bold">Your match</div>
            <h2 className="font-serif text-3xl font-semibold mt-1" style={{ fontFamily: "var(--font-serif)" }}>{beer.name}</h2>
            <div className="text-sm text-[color:var(--color-ink-soft)]">{beer.style} · {beer.abv}%</div>
            <div className="my-5 flex justify-center">
              <BeerPump slug={beer.slug} size={86} />
            </div>
            <p className="text-sm leading-relaxed">{beer.tasting}</p>
            <p className="text-xs text-[color:var(--color-ink-soft)] mt-3">{beer.blurb}</p>
          </Card>

          <Card className="p-4 mt-4">
            <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold">Pairs well with</div>
            <ul className="mt-2 text-sm space-y-1">
              {beer.pairings.map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
          </Card>

          <h3 className="mt-5 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>Pubs that stock it</h3>
          <div className="space-y-2">
            {stockingPubs.map((p) => (
              <Link key={p.id} href={`/search/${p.id}`}>
                <Card className="p-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-xs text-[color:var(--color-ink-soft)]">{p.town}</div>
                  </div>
                  <span className="text-[color:var(--color-ink-mute)]">›</span>
                </Card>
              </Link>
            ))}
          </div>

          <BarleyDivider className="my-6" />
          <Link href="/learn" className="block">
            <PrimaryButton className="w-full">Back to Learn</PrimaryButton>
          </Link>
        </div>
      </>
    );
  }

  const q = FLAVOUR_QUIZ[step];
  return (
    <>
      <AppHeader back="/learn" />
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between text-xs text-[color:var(--color-ink-soft)] mb-3">
          <span>Question {step + 1} of {FLAVOUR_QUIZ.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-[color:var(--color-line-soft)] overflow-hidden mb-5">
          <div
            className="h-full bg-[color:var(--color-amber)]"
            style={{ width: `${((step + 1) / FLAVOUR_QUIZ.length) * 100}%` }}
          />
        </div>

        <Card className="p-5">
          <h2 className="font-serif text-xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>{q.prompt}</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {q.options.map((o) => (
              <button
                key={o.label}
                onClick={() => choose(o.tags)}
                className="rounded-2xl border-2 border-[color:var(--color-line)] bg-white p-4 text-sm font-medium text-left hover:border-[color:var(--color-bottle)]"
              >
                {o.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
