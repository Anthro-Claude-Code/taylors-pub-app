"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/state";
import { BarleyCrest } from "@/components/Logo";
import { PrimaryButton, SecondaryButton, BarleyDivider } from "@/components/Pieces";

type Step = "welcome" | "age" | "name" | "ready";

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");

  const checkAge = () => {
    if (!dob) return setError("Please enter your date of birth.");
    const d = new Date(dob);
    const age = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18) {
      setError("You must be 18 or over to use this app.");
      return;
    }
    setError("");
    setStep("name");
  };

  const finish = () => {
    completeOnboarding(name || "Friend", true);
    router.replace("/home");
  };

  return (
    <div className="min-h-screen paper-texture flex flex-col">
      <div className="flex-1 max-w-md mx-auto w-full px-6 py-10 flex flex-col">
        <div className="flex justify-center mt-6 mb-8" style={{ color: "var(--color-bottle)" }}>
          <BarleyCrest size={94} />
        </div>

        {step === "welcome" && (
          <Welcome onContinue={() => setStep("age")} />
        )}
        {step === "age" && (
          <AgeGate dob={dob} setDob={setDob} error={error} onContinue={checkAge} onBack={() => setStep("welcome")} />
        )}
        {step === "name" && (
          <NameStep name={name} setName={setName} onContinue={() => setStep("ready")} onBack={() => setStep("age")} />
        )}
        {step === "ready" && <Ready onFinish={finish} />}
      </div>
    </div>
  );
}

function Welcome({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-serif font-semibold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
        Welcome to Timothy&nbsp;Taylor&apos;s
      </h1>
      <BarleyDivider className="my-5" />
      <p className="text-[15px] text-[color:var(--color-ink-soft)] leading-relaxed mb-8">
        Find a pub. Earn points. Learn the craft.
        <br />
        Stamp your passport. Pour one for a friend.
      </p>
      <ul className="grid gap-3 text-left mb-10">
        {[
          "1,000 points = £1, redeemable at any TT pub",
          "Cask freshness shown for every pub",
          "Streaks, levels, badges and shareable rewards",
        ].map((line) => (
          <li key={line} className="flex items-start gap-3 text-[14px]">
            <span className="text-[color:var(--color-gold-deep)] mt-0.5">●</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <PrimaryButton className="w-full" onClick={onContinue}>
        Get started
      </PrimaryButton>
      <p className="text-[11px] text-[color:var(--color-ink-mute)] mt-4">
        Drink responsibly. drinkaware.co.uk
      </p>
    </div>
  );
}

function AgeGate({ dob, setDob, error, onContinue, onBack }: { dob: string; setDob: (v: string) => void; error: string; onContinue: () => void; onBack: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
        Quick age check
      </h2>
      <p className="text-sm text-[color:var(--color-ink-soft)] mt-2 mb-6">
        Some rewards involve alcohol, so we need to know you&apos;re 18 or over. We don&apos;t store your DoB beyond this device.
      </p>
      <label className="block text-xs font-medium text-[color:var(--color-ink-soft)] mb-1">
        Date of birth
      </label>
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-4 py-3 text-base focus:outline-none focus:border-[color:var(--color-bottle)]"
      />
      {error && <p className="text-sm text-[color:var(--color-danger)] mt-2">{error}</p>}
      <div className="mt-6 flex gap-3">
        <SecondaryButton onClick={onBack} className="flex-1">
          Back
        </SecondaryButton>
        <PrimaryButton onClick={onContinue} className="flex-1">
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}

function NameStep({ name, setName, onContinue, onBack }: { name: string; setName: (v: string) => void; onContinue: () => void; onBack: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
        What shall we call you?
      </h2>
      <p className="text-sm text-[color:var(--color-ink-soft)] mt-2 mb-6">
        First name is fine. We&apos;ll use it on your passport.
      </p>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-4 py-3 text-base focus:outline-none focus:border-[color:var(--color-bottle)]"
      />
      <div className="mt-6 flex gap-3">
        <SecondaryButton onClick={onBack} className="flex-1">
          Back
        </SecondaryButton>
        <PrimaryButton onClick={onContinue} disabled={!name.trim()} className="flex-1">
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}

function Ready({ onFinish }: { onFinish: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
        You&apos;re in
      </h2>
      <p className="text-sm text-[color:var(--color-ink-soft)] mt-2 mb-6">
        We&apos;ve started you off with 1,250 points and three sample passport stamps so you can have a look around.
      </p>
      <ul className="space-y-2 text-sm mb-8">
        <li className="flex items-center gap-2"><span>🍺</span> Find a pub on the Search tab</li>
          <li className="flex items-center gap-2"><span>📚</span> Learn about cask ale and earn points</li>
          <li className="flex items-center gap-2"><span>🎫</span> Cash in points for a free pint</li>
          <li className="flex items-center gap-2"><span>📔</span> Stamp every visit in your Passport</li>
      </ul>
      <PrimaryButton className="w-full" onClick={onFinish}>
        Pour me a pint
      </PrimaryButton>
      <p className="text-[11px] text-[color:var(--color-ink-mute)] mt-4 text-center">
        Drink responsibly. drinkaware.co.uk
      </p>
    </div>
  );
}
