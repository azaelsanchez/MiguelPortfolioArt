import { getLocale } from "next-intl/server";
import { redirect } from "@/lib/i18n/navigation";

/**
 * El formulario de contacto vive ahora en la Home (`/#contact`), no en una
 * página aparte — redirige ahí a quien tenga un enlace o marcador antiguo a
 * `/contact`.
 */
export default async function ContactRedirect() {
  const locale = await getLocale();
  redirect({ href: "/#contact", locale });
}
