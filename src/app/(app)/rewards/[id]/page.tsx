"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, PrimaryButton, SecondaryButton, GoldButton, BarleyDivider } from "@/components/Pieces";
import { Sheet } from "@/components/Sheet";
import { rewardById, pubById } from "@/lib/seed";
import { useApp } from "@/lib/state";
import { notFound } from "next/navigation";

export default function RewardDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const reward = rewardById(id);
  const router = useRouter();
  const { state, redeemReward, shareReward, walletAdd, pushNotification } = useApp();
  const [shareOpen, setShareOpen] = useState(false);
  const [shareTo, setShareTo] = useState("");
  const [shareMsg, setShareMsg] = useState("Fancy a Taylor's this week?");
  const [redeemed, setRedeemed] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  if (!reward) return notFound();

  const canAfford = !reward.cost || state.points >= reward.cost;
  const ageBlocked = reward.ageRestricted && !state.ageVerified;
  const ddBlocked = state.ddModeOn && reward.ageRestricted;

  const onRedeem = () => {
    if (ageBlocked || ddBlocked) return;
    const v = redeemReward(reward.id);
    if (v) {
      setRedeemed(v.id);
      pushNotification({
        kind: "offer",
        title: "Voucher ready",
        body: `${reward.title} · valid for 24 hours`,
      });
    }
  };

  const onShare = () => {
    if (!shareTo.trim()) return;
    const sr = shareReward(reward.id, shareTo, shareMsg);
    if (sr) {
      setShared(true);
      pushNotification({
        kind: "friend",
        title: `Reward sent to ${shareTo}`,
        body: `${reward.title} · they have 7 days to accept.`,
      });
    }
  };

  const scopePub = reward.pubScope?.[0] ? pubById(reward.pubScope[0]) : null;

  return (
    <>
      <AppHeader back="/rewards" />
      <div className="px-4 pb-6">
        <div className="rounded-3xl pump-clip text-[color:var(--color-cream)] p-6 relative overflow-hidden">
          <div className="absolute right-3 top-3 text-7xl opacity-20">
            {reward.kind === "free-pint" ? "🍺" : reward.kind === "discount" ? "💰" : reward.kind === "draw" ? "🎰" : reward.kind === "birthday" ? "🎂" : reward.kind === "merch" ? "🎁" : "🚂"}
          </div>
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--color-gold)" }}>{reward.kind.replace("-", " ")}</div>
            <h1 className="font-serif text-2xl font-semibold mt-1" style={{ fontFamily: "var(--font-serif)" }}>{reward.title}</h1>
            <p className="text-sm opacity-90 mt-1">{reward.subtitle}</p>
            {reward.cost && (
              <div className="mt-4 inline-flex items-baseline gap-2 bg-white/10 rounded-full px-3 py-1">
                <span className="font-serif text-lg" style={{ fontFamily: "var(--font-serif)" }}>{reward.cost.toLocaleString()}</span>
                <span className="text-[10px] tracking-[0.18em] uppercase opacity-80">pts</span>
              </div>
            )}
          </div>
        </div>

        <Card className="mt-4 p-4">
          <p className="text-sm leading-relaxed">{reward.description}</p>
          {scopePub && (
            <div className="mt-3 pt-3 border-t border-[color:var(--color-line-soft)] text-sm">
              <div className="text-[color:var(--color-ink-soft)]">Available at</div>
              <Link href={`/search/${scopePub.id}`} className="font-semibold text-[color:var(--color-bottle)]">
                {scopePub.name}, {scopePub.town}
              </Link>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {reward.shareable && <Pill tone="gold">Shareable</Pill>}
            {reward.ageRestricted && <Pill tone="neutral">18+ only</Pill>}
            {reward.expires && <Pill tone="amber">Closes {reward.expires}</Pill>}
          </div>
        </Card>

        {/* Status messages */}
        {ddBlocked && (
          <Card className="mt-3 p-3 bg-[color:var(--color-cream-50)] text-sm">
            🚗 You&apos;re in DD mode. Switch off DD mode in Home or pick a soft-drink reward.
          </Card>
        )}
        {!canAfford && reward.cost && !redeemed && (
          <Card className="mt-3 p-3 text-sm">
            You need {(reward.cost - state.points).toLocaleString()} more points.
          </Card>
        )}

        {/* Action buttons */}
        <div className="mt-4 space-y-2">
          {redeemed ? (
            <Link href={`/rewards/voucher/${redeemed}`} className="block">
              <PrimaryButton className="w-full">Open my voucher</PrimaryButton>
            </Link>
          ) : (
            <>
              <PrimaryButton onClick={onRedeem} disabled={!canAfford || ddBlocked || ageBlocked} className="w-full">
                {reward.cost ? `Cash in ${reward.cost.toLocaleString()} pts` : "Activate reward"}
              </PrimaryButton>
              {reward.shareable && (
                <SecondaryButton onClick={() => setShareOpen(true)} className="w-full">
                  Send to a friend
                </SecondaryButton>
              )}
            </>
          )}
        </div>

        <BarleyDivider className="my-6" />
        <p className="text-[11px] text-[color:var(--color-ink-mute)] text-center">
          Drink responsibly. drinkaware.co.uk
        </p>
      </div>

      {/* Share sheet */}
      <Sheet open={shareOpen} onClose={() => setShareOpen(false)} title={shared ? "Sent" : "Send to a friend"}>
        {shared ? (
          <div className="text-center py-4 stamp-press">
            <div className="text-6xl mb-2">📨</div>
            <p className="text-base">Reward sent to <span className="font-semibold">{shareTo}</span>.</p>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">They have 7 days to accept. Both of you must be 18+ for an alcoholic reward.</p>
            <PrimaryButton className="w-full mt-5" onClick={() => { setShareOpen(false); setShared(false); router.push("/rewards"); }}>
              Done
            </PrimaryButton>
          </div>
        ) : (
          <div className="space-y-4">
            {reward.ageRestricted && (
              <div className="text-xs bg-[color:var(--color-cream-50)] rounded-xl p-3">
                Both of you need to be age-verified. Your friend will be asked at acceptance.
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] mb-1">Friend</label>
              <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
                {state.friends.map((f) => (
                  <button key={f.name} onClick={() => setShareTo(f.name)} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${shareTo === f.name ? "bg-[color:var(--color-bottle)] text-[color:var(--color-cream)] border-[color:var(--color-bottle)]" : "bg-white border-[color:var(--color-line)]"}`}>
                    {f.name}
                  </button>
                ))}
              </div>
              <input
                value={shareTo}
                onChange={(e) => setShareTo(e.target.value)}
                placeholder="Or type a name…"
                className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-bottle)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] mb-1">Message</label>
              <textarea
                rows={3}
                value={shareMsg}
                onChange={(e) => setShareMsg(e.target.value)}
                className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-bottle)]"
              />
            </div>
            <div className="flex gap-2">
              <SecondaryButton onClick={() => setShareOpen(false)} className="flex-1">Cancel</SecondaryButton>
              <PrimaryButton onClick={onShare} disabled={!shareTo.trim()} className="flex-1">Send</PrimaryButton>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}
