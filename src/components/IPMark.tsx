export function IPMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`text-center text-[9px] tracking-[0.08em] text-[color:var(--color-ink-mute)] py-2 select-none ${className}`}
      aria-label="Copyright"
    >
      © Ciara Cherry 2026 · Concept, design &amp; build · All rights reserved
    </div>
  );
}
