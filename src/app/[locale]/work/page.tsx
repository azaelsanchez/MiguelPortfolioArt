import { getLocale } from "next-intl/server";
import { redirect } from "@/lib/i18n/navigation";

/**
 * La rejilla de obra vive ahora en la Home (`/#work`), no en una página
 * aparte — redirige ahí a quien tenga un enlace o marcador antiguo a
 * `/work`. `/work/[slug]` (la ficha de cada proyecto) no se toca.
 */
export default async function WorkRedirect() {
  const locale = await getLocale();
  redirect({ href: "/#work", locale });
}
