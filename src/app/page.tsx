"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/state";
import { BarleyCrest } from "@/components/Logo";

export default function Index() {
  const router = useRouter();
  const { state, hydrated } = useApp();
  useEffect(() => {
    if (!hydrated) return;
    if (state.onboarded) router.replace("/home");
    else router.replace("/onboarding");
  }, [hydrated, state.onboarded, router]);
  return (
    <div className="min-h-screen flex items-center justify-center paper-texture">
      <div style={{ color: "var(--color-bottle)" }}>
        <BarleyCrest size={120} />
      </div>
    </div>
  );
}
