"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/rewards", label: "Rewards", icon: RewardIcon },
  { href: "/learn", label: "Learn", icon: LearnIcon },
  { href: "/passport", label: "Passport", icon: PassportIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="sticky bottom-0 left-0 right-0 z-30"
      style={{
        background: "linear-gradient(180deg, rgba(245,236,215,0.6), rgba(245,236,215,0.96) 30%, var(--color-cream) 100%)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid var(--color-line)",
      }}
    >
      <div className="mx-auto max-w-md px-2 pt-1 pb-[max(8px,env(safe-area-inset-bottom))]">
        <ul className="flex items-stretch justify-between">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-colors ${
                    active ? "tab-active" : "text-[color:var(--color-ink-soft)]"
                  }`}
                >
                  <Icon active={active} />
                  <span className="text-[11px] font-medium">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2v-9z" />
    </svg>
  );
}
function SearchIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}
function RewardIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14v3H5z" />
      <path d="M6 11v9h12v-9" />
      <path d="M12 4c2 0 3 1.2 3 3 0 0-1.5 1-3 1s-3-1-3-1c0-1.8 1-3 3-3z" />
      <path d="M12 11v9" />
    </svg>
  );
}
function LearnIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A2 2 0 0 1 6 4h12v15H6a2 2 0 0 0-2 2V5.5z" />
      <path d="M6 19h12" />
    </svg>
  );
}
function PassportIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <circle cx="12" cy="11" r="3" />
      <path d="M9 17h6" />
    </svg>
  );
}
