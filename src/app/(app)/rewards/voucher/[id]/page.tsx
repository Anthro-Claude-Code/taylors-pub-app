"use client";
import { use, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Card, PrimaryButton, SecondaryButton, BarleyDivider } from "@/components/Pieces";
import { Sheet } from "@/components/Sheet";
import { QrCode } from "@/components/QrCode";
import { rewardById } from "@/lib/seed";
import { useApp } from "@/lib/state";

export default function VoucherDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { state, voucherRedeem, walletAdd } = useApp();
  const v = state.vouchers.find((x) => x.id === id);
  const [confirmRedeem, setConfirmRedeem] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  if (!v) return notFound();
  const reward = rewardById(v.rewardId);
  if (!reward) return notFound();

  const onRedeem = () => {
    voucherRedeem(v.id);
    setRedeemed(true);
    setConfirmRedeem(false);
  };

  const expiresInH = Math.max(0, Math.round((new Date(v.expiresAt).getTime() - Date.now()) / 3600000));
  const expired = new Date(v.expiresAt) < new Date();

  return (
    <>
      <AppHeader back="/rewards" />
      <div className="px-4 pb-6">
        <Card className="p-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-amber)] font-bold">Voucher</div>
          <h1 className="font-serif text-2xl font-semibold mt-1" style={{ fontFamily: "var(--font-serif)" }}>
            {reward.title}
          </h1>
          <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">{reward.subtitle}</p>

          <BarleyDivider className="my-5" />

          {redeemed || v.redeemed ? (
            <div className="py-6">
              <div className="text-7xl mb-3">✅</div>
              <p className="font-serif text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>Redeemed</p>
              <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">Cheers. We hope it tasted good.</p>
            </div>
          ) : expired ? (
            <div className="py-6">
              <div className="text-6xl mb-2">⏳</div>
              <p className="font-serif text-xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>Voucher expired</p>
              <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">Try cashing in points for a fresh one.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <QrCode value={`TT-VOUCHER:${v.code}:${v.rewardId}`} size={210} />
              </div>
              <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[color:var(--color-line-soft)]">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">Code</span>
                <span className="font-mono text-base font-semibold tracking-widest">{v.code}</span>
              </div>
              <p className="text-xs text-[color:var(--color-ink-soft)] mt-3">
                Show this QR code to bar staff. Expires in {expiresInH}h. Single use.
              </p>
            </>
          )}
        </Card>

        {!redeemed && !v.redeemed && !expired && (
          <div className="mt-4 space-y-2">
            <PrimaryButton onClick={() => setConfirmRedeem(true)} className="w-full">
              Mark as redeemed
            </PrimaryButton>
            <SecondaryButton
              onClick={() => { walletAdd(v.id); setWalletAdded(true); }}
              className="w-full"
              disabled={walletAdded || state.walletPasses.includes(v.id)}
            >
              {walletAdded || state.walletPasses.includes(v.id) ? "✓ In your wallet" : "Add to Apple Wallet"}
            </SecondaryButton>
          </div>
        )}

        <p className="text-[11px] text-[color:var(--color-ink-mute)] mt-8 text-center">
          By redeeming you confirm you&apos;re 18+. Drink responsibly.
        </p>
      </div>

      <Sheet open={confirmRedeem} onClose={() => setConfirmRedeem(false)} title="Show this to bar staff">
        <p className="text-sm">
          Bar staff will scan or read your code. Once marked as redeemed, this voucher is invalid — they can&apos;t be reused.
        </p>
        <div className="mt-5 flex gap-2">
          <SecondaryButton onClick={() => setConfirmRedeem(false)} className="flex-1">Not yet</SecondaryButton>
          <PrimaryButton onClick={onRedeem} className="flex-1">Confirm redeemed</PrimaryButton>
        </div>
      </Sheet>
    </>
  );
}
