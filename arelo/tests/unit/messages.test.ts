import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

type Messages = { [key: string]: string | Messages };

function flattenKeys(messages: Messages, prefix = ""): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : flattenKeys(value, path);
  });
}

function flattenValues(messages: Messages): string[] {
  return Object.values(messages).flatMap((value) =>
    typeof value === "string" ? [value] : flattenValues(value),
  );
}

describe("translations", () => {
  it("has exactly the same keys in French and English", () => {
    expect(flattenKeys(en).sort()).toEqual(flattenKeys(fr).sort());
  });

  it("has no empty strings", () => {
    for (const value of [...flattenValues(fr), ...flattenValues(en)]) {
      expect(value.trim()).not.toBe("");
    }
  });
});
