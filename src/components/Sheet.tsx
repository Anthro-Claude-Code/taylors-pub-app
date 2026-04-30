"use client";
import { useEffect } from "react";

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-[rgba(15,36,25,0.5)] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl bg-[color:var(--color-paper)] shadow-2xl max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal
      >
        <div className="sticky top-0 px-5 pt-3 pb-2 bg-[color:var(--color-paper)] z-10">
          <div className="mx-auto h-1 w-10 rounded-full bg-[color:var(--color-line)] mb-3 sm:hidden" />
          <div className="flex items-center justify-between">
            {title ? (
              <h2 className="text-lg font-serif font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                {title}
              </h2>
            ) : (
              <span />
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-[color:var(--color-line-soft)]"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="px-5 pb-6">{children}</div>
      </div>
    </div>
  );
}
