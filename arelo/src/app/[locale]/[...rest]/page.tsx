import { notFound } from "next/navigation";

// Sends every unknown URL to the localized not-found page.
export default function CatchAllPage() {
  notFound();
}
