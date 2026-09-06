"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/95 backdrop-blur transition-shadow duration-300 supports-[backdrop-filter]:bg-background/80",
        scrolled ? "border-border shadow-lg shadow-black/20" : "border-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-h3 font-bold tracking-tight transition-colors hover:text-primary">
          Cardo
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label={t("primary")}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative py-1 text-small font-medium text-muted-foreground transition-colors after:absolute after:-bottom-[3px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full",
                  isActive ? "text-foreground after:w-full" : "after:w-0",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Button asChild>
            <Link href="/contact">{t("cta")}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("openMenu")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Cardo</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-6" aria-label={t("primary")}>
                {NAV_ITEMS.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    style={{ animationDelay: `${index * 60}ms` }}
                    className="animate-in fade-in slide-in-from-right-4 text-h3 font-medium fill-mode-both"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <Button asChild size="lg" onClick={() => setOpen(false)}>
                  <Link href="/contact">{t("cta")}</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
