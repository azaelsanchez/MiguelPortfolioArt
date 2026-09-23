import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/routing";
import { getProjectBySlug } from "@/lib/contentful/queries";

/**
 * Activa el draft mode desde un enlace de previsualización de Contentful.
 *
 * Configúralo en Contentful como Content preview URL:
 * `{NEXT_PUBLIC_SITE_URL}/api/draft?secret=...&locale={locale}&slug={entry.fields.slug}`
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const rawLocale = searchParams.get("locale") ?? undefined;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  if (!process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response(
      "CONTENTFUL_PREVIEW_SECRET no está configurado en el servidor.",
      { status: 501 },
    );
  }

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response("Token de previsualización inválido.", {
      status: 401,
    });
  }

  if (slug) {
    const project = await getProjectBySlug(locale, slug);
    if (!project) {
      return new Response("No existe ningún proyecto con ese slug.", {
        status: 404,
      });
    }
    (await draftMode()).enable();
    redirect(`/${locale}/work/${slug}`);
  }

  (await draftMode()).enable();
  redirect(`/${locale}`);
}
