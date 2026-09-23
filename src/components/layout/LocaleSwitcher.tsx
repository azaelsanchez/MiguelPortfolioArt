"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { locales } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

export function LocaleSwitcher({ className }: Props) {
  const t = useTranslations("locale");
  const activeLocale = useLocale();
  // Ruta sin el prefijo de idioma: conserva la página al cambiar de locale.
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")} className={cn("flex items-center", className)}>
      {locales.map((locale, index) => {
        const isActive = locale === activeLocale;

        return (
          <span key={locale} className="flex items-center">
            {index > 0 && (
              <span aria-hidden className="text-ink-subtle px-1.5">
                /
              </span>
            )}
            <Link
              href={pathname}
              locale={locale}
              hrefLang={locale}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "text-xs tracking-[0.16em] uppercase transition-colors duration-300 ease-(--ease-out-soft)",
                isActive ? "text-ink" : "text-ink-subtle hover:text-ink",
              )}
            >
              <span className="sr-only">{t(locale)}</span>
              <span aria-hidden>{t(`${locale}Short`)}</span>
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
