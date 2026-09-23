"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/cn";
import type { SocialLinks } from "@/lib/contentful/types";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { SocialIconLinks } from "./SocialIconLinks";

type Props = {
  socialLinks: SocialLinks;
};

/**
 * Fija y siempre visible: con Home funcionando como una mini-SPA (secciones
 * con ancla para Obra y Contacto), esconder el menú al bajar obligaría a
 * subir para volver a navegar. Solo cambia de fondo — transparente arriba
 * del todo, papel + blur al bajar — para no competir con el hero.
 */
export function Header({ socialLinks }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Los enlaces del menú móvil lo cierran al navegar (ver `MobileMenu`).
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-(--ease-out-soft)",
          scrolled && !menuOpen
            ? "border-line/60 bg-canvas/45 border-b backdrop-blur-lg"
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
                          ? "text-accent"
                          : "text-ink-muted hover:text-accent",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden items-center gap-6 md:flex">
              <span aria-hidden className="bg-line-strong h-4 w-px" />
              <SocialIconLinks
                socialLinks={socialLinks}
                className="flex items-center gap-4"
              />
              <span aria-hidden className="bg-line-strong h-4 w-px" />
              <LocaleSwitcher />
            </div>

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

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        socialLinks={socialLinks}
      />
    </>
  );
}
