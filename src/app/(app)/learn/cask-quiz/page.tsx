"use client";
import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, PrimaryButton, SecondaryButton, BarleyDivider } from "@/components/Pieces";
import { CASK_QUIZ } from "@/lib/seed";
import { useApp } from "@/lib/state";

export default function CaskQuiz() {
  const { setQuizScore } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<("A" | "B" | "C" | null)[]>(Array(CASK_QUIZ.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const choose = (key: "A" | "B" | "C") => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = key;
      return next;
    });
  };
  const correctCount = answers.reduce((acc, a, i) => acc + (a === CASK_QUIZ[i].correct ? 1 : 0), 0);

  const next = () => {
    if (step < CASK_QUIZ.length - 1) setStep(step + 1);
    else {
      const earned = setQuizScore("cask", correctCount, CASK_QUIZ.length);
      setPointsEarned(earned);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <>
        <AppHeader back="/learn" />
        <div className="px-4 pb-6">
          <Card className="p-6 text-center stamp-press">
            <div className="text-6xl mb-2">🎉</div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-gold-deep)] font-bold">Quiz complete</p>
            <p className="font-serif text-3xl font-semibold mt-1" style={{ fontFamily: "var(--font-serif)" }}>
              {correctCount} / {CASK_QUIZ.length}
            </p>
            {pointsEarned > 0 && (
              <p className="text-sm text-[color:var(--color-success)] mt-2 font-semibold">
                +{pointsEarned} pts banked
              </p>
            )}
          </Card>

          <BarleyDivider className="my-5" />

          <div className="space-y-2">
            {CASK_QUIZ.map((q, i) => {
              const ok = answers[i] === q.correct;
              return (
                <Card key={q.id} className="p-3">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 text-base ${ok ? "text-[color:var(--color-success)]" : "text-[color:var(--color-danger)]"}`}>
                      {ok ? "✓" : "✗"}
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{q.prompt}</div>
                      <div className="text-xs text-[color:var(--color-ink-soft)] mt-0.5">{q.explanation}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Link href="/learn" className="block mt-5">
            <PrimaryButton className="w-full">Back to Learn</PrimaryButton>
          </Link>
        </div>
      </>
    );
  }

  const q = CASK_QUIZ[step];
  const picked = answers[step];

  return (
    <>
      <AppHeader back="/learn" />
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between text-xs text-[color:var(--color-ink-soft)] mb-3">
          <span>Question {step + 1} of {CASK_QUIZ.length}</span>
          <span>{correctCount} correct so far</span>
        </div>
        <div className="h-1.5 rounded-full bg-[color:var(--color-line-soft)] overflow-hidden mb-5">
          <div
            className="h-full bg-[color:var(--color-bottle)]"
            style={{ width: `${((step + 1) / CASK_QUIZ.length) * 100}%` }}
          />
        </div>

        <Card className="p-5">
          <h2 className="font-serif text-xl font-semibold leading-snug" style={{ fontFamily: "var(--font-serif)" }}>{q.prompt}</h2>
          <div className="mt-4 grid gap-2">
            {q.options.map((o) => {
              const chosen = picked === o.key;
              return (
                <button
                  key={o.key}
                  onClick={() => choose(o.key)}
                  className={`w-full text-left rounded-2xl border-2 p-3 flex items-center gap-3 ${
                    chosen ? "border-[color:var(--color-bottle)] bg-[color:var(--color-line-soft)]" : "border-[color:var(--color-line)] bg-white"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-serif font-semibold text-sm ${
                    chosen ? "bg-[color:var(--color-bottle)] text-[color:var(--color-cream)]" : "bg-[color:var(--color-line-soft)] text-[color:var(--color-ink)]"
                  }`}>
                    {o.key}
                  </span>
                  <span className="text-sm">{o.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="mt-4">
          <PrimaryButton onClick={next} disabled={!picked} className="w-full">
            {step < CASK_QUIZ.length - 1 ? "Next" : "Finish"}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}
