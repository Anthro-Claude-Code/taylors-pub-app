"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Card, PrimaryButton, SecondaryButton, BarleyDivider } from "@/components/Pieces";
import { Sheet } from "@/components/Sheet";
import { useApp } from "@/lib/state";

export default function Settings() {
  const router = useRouter();
  const { state, setState, reset, toggleDDMode } = useApp();
  const [resetOpen, setResetOpen] = useState(false);
  const [name, setName] = useState(state.name);

  const onSaveName = () => {
    setState((s) => ({ ...s, name, initial: name?.[0]?.toUpperCase() || "?" }));
  };

  return (
    <>
      <AppHeader back="/home" title="Settings" />
      <div className="px-4 pb-6">
        <Card className="p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold">Profile</div>
          <div className="mt-2">
            <label className="text-xs text-[color:var(--color-ink-soft)]">Name</label>
            <div className="flex gap-2 mt-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-bottle)]"
              />
              <SecondaryButton onClick={onSaveName} className="text-sm py-2 px-3">Save</SecondaryButton>
            </div>
          </div>
        </Card>

        <Card className="mt-4 p-4 flex items-center gap-3">
          <div className="text-2xl">🚗</div>
          <div className="flex-1">
            <div className="text-sm font-semibold">DD mode</div>
            <div className="text-xs text-[color:var(--color-ink-soft)]">Earn points on soft drinks. Hide alcoholic rewards.</div>
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

        <Card className="mt-4 p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)] font-semibold">About</div>
          <div className="text-sm mt-1 leading-relaxed">
            A demo loyalty app for Timothy Taylor&apos;s — built to show what could be.
            All pub data is real; user data is stored in this browser only.
          </div>
        </Card>

        <Card className="mt-4 p-4 bg-[color:var(--color-cream-50)]">
          <div className="text-sm font-semibold mb-1">Drink responsibly</div>
          <p className="text-xs text-[color:var(--color-ink-soft)]">
            We support drinkaware.co.uk. Set your limits, know your units, and please don&apos;t drink and drive.
          </p>
        </Card>

        <BarleyDivider className="my-6" />

        <SecondaryButton className="w-full" onClick={() => setResetOpen(true)}>
          Reset demo data
        </SecondaryButton>
      </div>

      <Sheet open={resetOpen} onClose={() => setResetOpen(false)} title="Reset everything?">
        <p className="text-sm">This wipes all points, passport entries and vouchers and starts you back at the welcome screen. Useful for demoing.</p>
        <div className="mt-5 flex gap-2">
          <SecondaryButton className="flex-1" onClick={() => setResetOpen(false)}>Cancel</SecondaryButton>
          <PrimaryButton className="flex-1" onClick={() => { reset(); router.replace("/onboarding"); }}>
            Reset
          </PrimaryButton>
        </div>
      </Sheet>
    </>
  );
}
