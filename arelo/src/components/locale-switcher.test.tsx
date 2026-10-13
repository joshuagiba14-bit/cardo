import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import fr from "../../messages/fr.json";
import { LocaleSwitcher } from "./locale-switcher";

vi.mock("next/navigation", () => ({
  useParams: () => ({}),
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/",
  Link: ({
    children,
    locale,
    ...props
  }: React.ComponentProps<"a"> & { locale: string }) => (
    <a data-locale={locale} {...props}>
      {children}
    </a>
  ),
}));

describe("LocaleSwitcher", () => {
  it("offers English when the page is in French", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={fr}>
        <LocaleSwitcher />
      </NextIntlClientProvider>,
    );

    const link = screen.getByRole("link", { name: "English" });
    expect(link).toHaveAttribute("data-locale", "en");
    expect(link).toHaveAttribute("lang", "en");
    expect(
      screen.getByRole("navigation", { name: "Langue" }),
    ).toBeInTheDocument();
  });
});
