"use client";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, BarleyDivider } from "@/components/Pieces";
import { REWARDS, rewardById } from "@/lib/seed";
import { useApp } from "@/lib/state";
import type { Reward } from "@/lib/types";

export default function Rewards() {
  const { state } = useApp();
  const activeVouchers = state.vouchers.filter((v) => !v.redeemed && new Date(v.expiresAt) > new Date());
  const grouped = {
    drinks: REWARDS.filter((r) => r.kind === "free-pint" || r.kind === "discount"),
    trails: REWARDS.filter((r) => r.kind === "trail-stamp" || r.kind === "draw"),
    extras: REWARDS.filter((r) => r.kind === "birthday" || r.kind === "merch"),
  };

  return (
    <>
      <AppHeader title="Rewards" subtitle={`${state.points.toLocaleString()} pts · 1,000 = £1`} />
      <div className="px-4 pb-6">
        {/* Active vouchers */}
        {activeVouchers.length > 0 && (
          <>
            <h2 className="text-base font-serif font-semibold mb-2" style={{ fontFamily: "var(--font-serif)" }}>Ready to redeem</h2>
            <div className="space-y-3 mb-5">
              {activeVouchers.map((v) => {
                const r = rewardById(v.rewardId);
                if (!r) return null;
                const expiresInH = Math.max(0, Math.round((new Date(v.expiresAt).getTime() - Date.now()) / 3600000));
                return (
                  <Link key={v.id} href={`/rewards/voucher/${v.id}`}>
                    <Card className="p-4 border-2 border-[color:var(--color-amber)] bg-[color:var(--color-cream-50)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-amber)] font-bold">Active voucher</div>
                          <div className="font-serif text-lg font-semibold mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>{r.title}</div>
                          <div className="text-xs text-[color:var(--color-ink-soft)] mt-0.5">Expires in {expiresInH}h · code {v.code}</div>
                        </div>
                        <div className="text-3xl">🎫</div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Round mode */}
        <Link href="/rewards/round" className="block mb-5">
          <Card className="p-4 flex items-center gap-3 border-2 border-[color:var(--color-bottle)]/15">
            <div className="w-10 h-10 rounded-xl bg-[color:var(--color-bottle)] text-[color:var(--color-cream)] flex items-center justify-center text-xl">🍻</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Round mode</div>
              <div className="text-xs text-[color:var(--color-ink-soft)]">Pool points with a friend to cover a round</div>
            </div>
            <span className="text-[color:var(--color-ink-mute)]">›</span>
          </Card>
        </Link>

        <h2 className="text-base font-serif font-semibold mb-2" style={{ fontFamily: "var(--font-serif)" }}>Drink rewards</h2>
        <div className="space-y-3 mb-5">
          {grouped.drinks.map((r) => (
            <RewardRow key={r.id} reward={r} points={state.points} />
          ))}
        </div>

        <h2 className="text-base font-serif font-semibold mb-2" style={{ fontFamily: "var(--font-serif)" }}>Trails & prize draws</h2>
        <div className="space-y-3 mb-5">
          {grouped.trails.map((r) => (
            <RewardRow key={r.id} reward={r} points={state.points} />
          ))}
        </div>

        <h2 className="text-base font-serif font-semibold mb-2" style={{ fontFamily: "var(--font-serif)" }}>On-the-house & merch</h2>
        <div className="space-y-3 mb-5">
          {grouped.extras.map((r) => (
            <RewardRow key={r.id} reward={r} points={state.points} />
          ))}
        </div>

        {/* Shared rewards activity */}
        {state.sharedRewards.length > 0 && (
          <>
            <BarleyDivider className="my-6" />
            <h2 className="text-base font-serif font-semibold mb-2" style={{ fontFamily: "var(--font-serif)" }}>Sent to friends</h2>
            <div className="space-y-2">
              {state.sharedRewards.slice(0, 5).map((sr) => {
                const r = rewardById(sr.rewardId);
                return (
                  <Card key={sr.id} className="p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[color:var(--color-amber)] text-white flex items-center justify-center font-serif">{sr.toName[0]}</div>
                    <div className="flex-1 text-sm">
                      <div className="font-semibold">{r?.title}</div>
                      <div className="text-xs text-[color:var(--color-ink-soft)]">to {sr.toName} · {new Date(sr.sentAt).toLocaleDateString()}</div>
                    </div>
                    <Pill tone={sr.redeemed ? "gold" : sr.accepted ? "green" : "neutral"}>
                      {sr.redeemed ? "Redeemed" : sr.accepted ? "Accepted" : "Sent"}
                    </Pill>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        <p className="text-[11px] text-[color:var(--color-ink-mute)] mt-8 text-center">
          Drink responsibly. drinkaware.co.uk
        </p>
      </div>
    </>
  );
}

function RewardRow({ reward, points }: { reward: Reward; points: number }) {
  const canAfford = !reward.cost || points >= reward.cost;
  return (
    <Link href={`/rewards/${reward.id}`}>
      <Card className={`p-4 ${!canAfford ? "opacity-65" : ""}`}>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 shrink-0 rounded-xl bg-[color:var(--color-gold-soft)] flex items-center justify-center text-2xl">
            {reward.kind === "free-pint" ? "🍺" : reward.kind === "discount" ? "💰" : reward.kind === "draw" ? "🎰" : reward.kind === "birthday" ? "🎂" : reward.kind === "merch" ? "🎁" : "🚂"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-[15px] font-semibold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{reward.title}</div>
            <div className="text-xs text-[color:var(--color-ink-soft)] mt-0.5">{reward.subtitle}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {reward.shareable && <Pill tone="gold">Shareable</Pill>}
              {reward.ageRestricted && <Pill tone="neutral">18+</Pill>}
              {reward.kind === "trail-stamp" && <Pill tone="amber">Trail</Pill>}
            </div>
          </div>
          {reward.cost && (
            <div className="text-right">
              <div className="font-serif text-[15px] font-semibold" style={{ fontFamily: "var(--font-serif)" }}>{reward.cost.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">pts</div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
