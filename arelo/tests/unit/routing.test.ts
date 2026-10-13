import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";

describe("routing", () => {
  it("uses French as the default locale (Bill 96)", () => {
    expect(routing.defaultLocale).toBe("fr");
  });

  it("supports French and English only", () => {
    expect(routing.locales).toEqual(["fr", "en"]);
  });
});
