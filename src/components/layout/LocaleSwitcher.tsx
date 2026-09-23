"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { locales } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

const FLAGS: Record<(typeof locales)[number], string> = {
  es: "/flags/es.svg",
  en: "/flags/gb.svg",
};

export function LocaleSwitcher({ className }: Props) {
  const t = useTranslations("locale");
  const activeLocale = useLocale();
  // Ruta sin el prefijo de idioma: conserva la página al cambiar de locale.
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")} className={cn("flex items-center gap-2.5", className)}>
      {locales.map((locale) => {
        const isActive = locale === activeLocale;

        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "block overflow-hidden rounded-[3px] ring-offset-2 ring-offset-canvas transition-all duration-300 ease-(--ease-out-soft)",
              isActive
                ? "opacity-100 ring-2 ring-accent"
                : "opacity-50 grayscale hover:opacity-90 hover:grayscale-0",
            )}
          >
            <span className="sr-only">{t(locale)}</span>
            {/* eslint-disable-next-line @next/next/no-img-element -- icono estático de 60×30, no necesita next/image */}
            <img src={FLAGS[locale]} alt="" aria-hidden className="block h-4 w-[1.6rem] object-cover" />
          </Link>
        );
      })}
    </nav>
  );
}
