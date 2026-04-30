"use client";
import { useApp } from "@/lib/state";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { state, hydrated } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (hydrated && !state.onboarded) router.replace("/onboarding");
  }, [hydrated, state.onboarded, router]);

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <main className="flex-1 max-w-md w-full mx-auto pb-2">{children}</main>
      <BottomNav />
    </div>
  );
}
