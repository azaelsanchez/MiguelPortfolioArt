"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";

/** Umbral a partir del cual el header empieza a ocultarse al bajar. */
const HIDE_AFTER = 120;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Los enlaces del menú móvil lo cierran al navegar (ver `MobileMenu`).
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);
      setHidden(currentY > HIDE_AFTER && currentY > lastY);
      lastY = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-(--ease-out-soft)",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          scrolled && !menuOpen
            ? "border-line bg-canvas/85 border-b backdrop-blur-md"
            : "border-b border-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between md:h-20">
          <Link
            href="/"
            className="font-display text-ink text-base tracking-tight md:text-lg"
          >
            Miguel Ángel Gómez Balbuena
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden md:block">
              <ul className="flex items-center gap-8">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={
                        pathname.startsWith(item.href) ? "page" : undefined
                      }
                      className={cn(
                        "text-sm transition-colors duration-300 ease-(--ease-out-soft)",
                        pathname.startsWith(item.href)
                          ? "text-ink"
                          : "text-ink-muted hover:text-ink",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <LocaleSwitcher className="hidden md:flex" />

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="relative z-50 -mr-2 flex h-10 w-10 items-center justify-center md:hidden"
            >
              <span className="sr-only">
                {menuOpen ? t("closeMenu") : t("openMenu")}
              </span>
              <span aria-hidden className="relative block h-3 w-6">
                <span
                  className={cn(
                    "bg-ink absolute inset-x-0 block h-px transition-transform duration-300 ease-(--ease-out-soft)",
                    menuOpen ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "bg-ink absolute inset-x-0 block h-px transition-transform duration-300 ease-(--ease-out-soft)",
                    menuOpen ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </span>
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
