import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/routing";
import { getSiteUrl } from "@/lib/seo";
import { getProjectSlugs } from "@/lib/contentful/queries";

// "/work" y "/contact" no están: son redirecciones a anclas de la Home
// ("/#work", "/#contact"), no páginas con contenido propio.
const STATIC_PATHS = ["", "/about"];

function localizedUrl(path: string, locale: string): string {
  return `${getSiteUrl()}/${locale}${path}`;
}

function alternatesFor(path: string) {
  return {
    languages: Object.fromEntries(
      locales.map((locale) => [locale, localizedUrl(path, locale)]),
    ),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProjectSlugs();
  const paths = [...STATIC_PATHS, ...slugs.map((slug) => `/work/${slug}`)];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: localizedUrl(path, locale),
      lastModified: new Date(),
      alternates: alternatesFor(path),
    })),
  );
}
