"use client";
import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, BarleyDivider, PrimaryButton } from "@/components/Pieces";
import { TRAILS, pubById, rewardById } from "@/lib/seed";
import { useApp } from "@/lib/state";

export default function TrailDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trail = TRAILS.find((t) => t.id === id);
  const { state } = useApp();
  if (!trail) return notFound();

  const pubs = trail.pubIds.map((p) => pubById(p)!);
  const visited = trail.pubIds.filter((p) => state.pubsVisited.includes(p));
  const completed = visited.length === trail.pubIds.length;
  const reward = rewardById(trail.rewardId);

  return (
    <>
      <AppHeader back="/search" />
      <div className="px-4 pb-6">
        <div className="rounded-3xl bg-gradient-to-br from-[color:var(--color-amber)] to-[color:var(--color-amber-soft)] text-white p-6 relative overflow-hidden">
          <div className="absolute right-2 top-2 text-7xl opacity-25">{trail.image}</div>
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.22em] opacity-90">Trail</div>
            <h1 className="font-serif text-2xl font-semibold mt-1" style={{ fontFamily: "var(--font-serif)" }}>{trail.name}</h1>
            <p className="text-sm opacity-95 mt-1">{trail.description}</p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] opacity-90 mb-1">
              <span>Progress</span>
              <span>{visited.length}/{trail.pubIds.length}</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${(visited.length / trail.pubIds.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <h2 className="mt-5 mb-2 text-base font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>The four stops</h2>
        <div className="space-y-3">
          {pubs.map((pub) => {
            const stamped = state.pubsVisited.includes(pub.id);
            return (
              <Link key={pub.id} href={`/search/${pub.id}`}>
                <Card className={`p-4 ${stamped ? "border-l-4 border-l-[color:var(--color-bottle)]" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${stamped ? "border-[color:var(--color-bottle)] bg-[color:var(--color-line-soft)] text-[color:var(--color-bottle)]" : "border-dashed border-[color:var(--color-line)] text-[color:var(--color-ink-mute)]"}`}>
                      {stamped ? "✓" : "○"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-base font-semibold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{pub.name}</div>
                      <div className="text-xs text-[color:var(--color-ink-soft)]">{pub.town} · {pub.county}</div>
                    </div>
                    {stamped && <Pill tone="green">Stamped</Pill>}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <BarleyDivider className="my-6" />

        {reward && (
          <Card className="p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-gold-deep)] font-bold">Completion reward</div>
            <div className="font-serif text-lg font-semibold mt-1" style={{ fontFamily: "var(--font-serif)" }}>{reward.title}</div>
            <p className="text-xs text-[color:var(--color-ink-soft)] mt-1">{reward.description}</p>
            {completed && (
              <Link href={`/rewards/${reward.id}`} className="block mt-3">
                <PrimaryButton className="w-full">Claim your reward</PrimaryButton>
              </Link>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
