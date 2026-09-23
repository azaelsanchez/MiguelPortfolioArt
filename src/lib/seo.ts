import type { Metadata } from "next";
import { locales, type Locale } from "./i18n/routing";

/** URL absoluta del sitio, con fallback a localhost para que OG/sitemap funcionen en dev. */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/**
 * `alternates` para `generateMetadata`: canonical de la página actual +
 * `hreflang` hacia su equivalente en cada idioma. `path` va sin locale,
 * p. ej. `/work/blackout` o `""` para la home.
 */
export function buildAlternates(
  locale: Locale,
  path: string,
): Metadata["alternates"] {
  const siteUrl = getSiteUrl();

  return {
    canonical: `${siteUrl}/${locale}${path}`,
    languages: Object.fromEntries(
      locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
    ),
  };
}
