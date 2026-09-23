import { defineRouting } from "next-intl/routing";

export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Siempre con prefijo: `/` redirige a `/es`.
  localePrefix: "always",
});

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

/**
 * Normaliza el segmento `[locale]` a un `Locale`.
 *
 * Útil en `generateMetadata`, donde `params` llega tipado como `string`. El
 * layout ya devuelve 404 si el segmento no es un idioma válido.
 */
export function toLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}
