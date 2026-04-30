"use client";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/Pieces";
import { useApp } from "@/lib/state";

const ICONS: Record<string, string> = {
  freshness: "🍺",
  streak: "🔥",
  friend: "👥",
  offer: "🎫",
  trail: "🚂",
  system: "✨",
};

export default function Notifications() {
  const { state, markNotificationRead } = useApp();
  return (
    <>
      <AppHeader back="/home" title="Notifications" />
      <div className="px-4 pb-6">
        {state.notifications.length === 0 ? (
          <Card className="p-6 text-center text-sm text-[color:var(--color-ink-soft)]">
            All caught up. We&apos;ll ping you when something tasty&apos;s on tap.
          </Card>
        ) : (
          <div className="space-y-3">
            {state.notifications.map((n) => (
              <NotificationRow key={n.id} n={n} onRead={() => markNotificationRead(n.id)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function NotificationRow({ n, onRead }: { n: ReturnType<typeof useApp>["state"]["notifications"][number]; onRead: () => void }) {
  const inner = (
    <Card className={`p-4 ${!n.read ? "border-l-4 border-l-[color:var(--color-amber)]" : "opacity-80"}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[color:var(--color-line-soft)] flex items-center justify-center text-xl">
          {ICONS[n.kind] || "✨"}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-sm font-semibold leading-tight">{n.title}</div>
            <div className="text-[10px] text-[color:var(--color-ink-mute)] whitespace-nowrap">
              {timeAgo(new Date(n.date))}
            </div>
          </div>
          <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">{n.body}</p>
          {n.cta && <span className="text-xs text-[color:var(--color-bottle)] font-semibold mt-2 inline-block">{n.cta.label} →</span>}
        </div>
      </div>
    </Card>
  );
  if (n.cta) {
    return (
      <Link href={n.cta.href} onClick={onRead}>
        {inner}
      </Link>
    );
  }
  return <button className="text-left w-full" onClick={onRead}>{inner}</button>;
}

function timeAgo(d: Date) {
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "now";
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  return `${days}d`;
}
