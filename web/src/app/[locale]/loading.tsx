import { LoadingScreen } from "@/components/loading-screen";

export default function LocaleLoading() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[70vh] items-center justify-center">
      <LoadingScreen />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
