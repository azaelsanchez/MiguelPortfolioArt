import { getRequestConfig } from "next-intl/server";
import { locale as localeRootParam } from "next/root-params";
import { defaultLocale, isLocale } from "./routing";

/**
 * Configuración de next-intl por petición.
 *
 * El idioma se lee del segmento raíz `[locale]` con `next/root-params`, que es
 * la vía recomendada en Next 16 y la única que permite prerenderizar las
 * páginas (SSG). Los root params no existen en Route Handlers ni en Server
 * Actions: allí hay que pasar el idioma explícitamente, por ejemplo con
 * `getTranslations({ locale })`, y ese valor llega aquí como `locale`.
 */
export default getRequestConfig(async ({ locale: explicitLocale }) => {
  const resolved = explicitLocale ?? (await localeRootParam());
  const locale = isLocale(resolved) ? resolved : defaultLocale;

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
    timeZone: "Europe/Madrid",
  };
});
