"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// A short message that goes away by itself after 5 seconds: for news that
// needs no action, such as "Copied". Wrap the page in <ToastProvider> and
// call toast("…") from inside it.
//
// There's one region, always in the page and polite, so screen readers
// announce each message without interrupting. A new message replaces the
// one showing, so there's never more than one. Close or Escape dismisses
// it. The timer waits while the pointer or keyboard focus is on the toast,
// so it doesn't vanish while you're reaching for Close.
//
// A message with an action, such as Undo, isn't a toast: 5 seconds is too
// short to reach it with a keyboard or screen reader. Use a Notice.

const DURATION = 5000;

const ToastContext = createContext<(message: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  // The key restarts the timer when the same words are shown twice.
  const [current, setCurrent] = useState<{ key: number; message: string } | null>(null);
  const [paused, setPaused] = useState(false);
  const nextKey = useRef(0);

  const toast = useCallback((message: string) => {
    nextKey.current += 1;
    setCurrent({ key: nextKey.current, message });
  }, []);

  const dismiss = useCallback(() => {
    setCurrent(null);
    setPaused(false);
  }, []);

  useEffect(() => {
    if (!current || paused) return;
    const timer = setTimeout(dismiss, DURATION);
    return () => clearTimeout(timer);
  }, [current, paused, dismiss]);

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, dismiss]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Above the phone's bottom navigation; near the bottom on laptops. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 flex justify-center px-4 md:bottom-6">
        <div
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className={
            current
              ? "pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-card border border-line-strong bg-surface py-1 pr-1 pl-4 text-ink shadow-raised"
              : "contents"
          }
        >
          <div role="status" aria-live="polite" aria-atomic="true" className="min-w-0 flex-1 py-2">
            {current && <p key={current.key}>{current.message}</p>}
          </div>
          {current && (
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-control text-ink transition-colors state-hover:bg-accent-soft state-active:bg-accent-soft"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 5l10 10M15 5 5 15" />
              </svg>
              <span className="sr-only">Close message</span>
            </button>
          )}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
