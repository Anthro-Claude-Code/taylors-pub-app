"use client";
import Link from "next/link";
import { useApp } from "@/lib/state";
import { WordMark } from "./Logo";

export function AppHeader({ title, subtitle, back }: { title?: string; subtitle?: string; back?: string }) {
  const { state } = useApp();
  const unread = state.notifications.filter((n) => !n.read).length;
  return (
    <header className="sticky top-0 z-20 bg-[color:var(--color-cream)]/85 backdrop-blur-md border-b border-[color:var(--color-line-soft)]">
      <div className="max-w-md mx-auto px-4 pt-3 pb-2 flex items-center justify-between">
        {back ? (
          <Link href={back} className="inline-flex items-center gap-1 text-sm text-[color:var(--color-ink-soft)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            <span>Back</span>
          </Link>
        ) : (
          <div style={{ color: "var(--color-bottle)" }}>
            <WordMark small />
          </div>
        )}
        <div className="flex items-center gap-2">
          <Link href="/notifications" className="relative rounded-full p-2 hover:bg-[color:var(--color-line-soft)]" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bottle)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" />
              <path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
            {unread > 0 && (
              <span className="absolute top-1 right-1 rounded-full bg-[color:var(--color-amber)] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center">{unread}</span>
            )}
          </Link>
          <Link href="/settings" className="rounded-full bg-[color:var(--color-bottle)] text-[color:var(--color-cream)] w-9 h-9 flex items-center justify-center font-serif text-base">
            {state.initial}
          </Link>
        </div>
      </div>
      {title && (
        <div className="max-w-md mx-auto px-4 pb-3">
          <h1 className="text-2xl font-serif font-semibold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
            {title}
          </h1>
          {subtitle && <p className="text-sm text-[color:var(--color-ink-soft)] mt-0.5">{subtitle}</p>}
        </div>
      )}
    </header>
  );
}
