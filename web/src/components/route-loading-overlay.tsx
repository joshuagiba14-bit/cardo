"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingScreen } from "@/components/loading-screen";
import { cn } from "@/lib/utils";

const MIN_VISIBLE_MS = 350;
const SAFETY_TIMEOUT_MS = 6000;

/**
 * Guarantees a visible transition on every internal link click, even when
 * the destination page's data fetch resolves too fast (typical on
 * localhost) for the Suspense-driven loading.tsx to register. Mounted once
 * per root layout — it persists across navigations instead of remounting.
 */
export function RouteLoadingOverlay({ label }: { label?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  const shownAtRef = useRef<number | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const currentKeyRef = useRef(`${pathname}?${searchParams.toString()}`);

  useEffect(() => {
    function show() {
      if (shownAtRef.current !== null) return;
      shownAtRef.current = Date.now();
      setVisible(true);
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        shownAtRef.current = null;
        setVisible(false);
      }, SAFETY_TIMEOUT_MS);
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (/^(mailto:|tel:|javascript:)/.test(href)) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname + url.search === window.location.pathname + window.location.search) return;

      show();
    }

    function handlePopState() {
      show();
    }

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const key = `${pathname}?${searchParams.toString()}`;
    if (key === currentKeyRef.current) return;
    currentKeyRef.current = key;

    if (shownAtRef.current === null) return;

    const elapsed = Date.now() - shownAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      shownAtRef.current = null;
      clearTimeout(safetyTimerRef.current);
      setVisible(false);
    }, remaining);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => {
    return () => {
      clearTimeout(hideTimerRef.current);
      clearTimeout(safetyTimerRef.current);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <LoadingScreen label={label} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
