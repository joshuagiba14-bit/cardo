import { cn } from "@/lib/utils";

/**
 * Shared visual for both the Suspense fallback (loading.tsx, server-rendered,
 * shown for real data-fetch latency) and the client-side route transition
 * overlay (shown immediately on link click, for perceived responsiveness).
 */
export function LoadingScreen({
  label = "Cardo",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-5", className)}>
      <p className="font-display text-h2 font-bold tracking-tight text-primary animate-pulse motion-reduce:animate-none">
        {label}
      </p>
      <div className="h-0.5 w-28 overflow-hidden rounded-full bg-border">
        <div className="h-full w-1/3 animate-loading-bar rounded-full bg-primary motion-reduce:animate-none motion-reduce:w-full" />
      </div>
    </div>
  );
}
