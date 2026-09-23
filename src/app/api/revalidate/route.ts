import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Webhook de Contentful (publish/unpublish/delete). Configúralo en
 * Settings → Webhooks apuntando a `{NEXT_PUBLIC_SITE_URL}/api/revalidate`
 * con la cabecera `x-revalidate-secret: {CONTENTFUL_REVALIDATE_SECRET}`.
 *
 * Todas las consultas de `lib/contentful/queries.ts` comparten la etiqueta
 * `contentful`, así que revalidar esa única etiqueta basta para refrescar
 * cualquier contenido: proyectos, exposiciones, ajustes del sitio…
 */
export async function POST(request: NextRequest) {
  if (!process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json(
      {
        message:
          "CONTENTFUL_REVALIDATE_SECRET no está configurado en el servidor.",
      },
      { status: 501 },
    );
  }

  const secret = request.headers.get("x-revalidate-secret");
  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Token inválido." }, { status: 401 });
  }

  // `{ expire: 0 }` fuerza una revalidación inmediata y bloqueante en la
  // siguiente petición, en vez del `profile: "max"` recomendado por defecto
  // (que serviría contenido obsoleto mientras revalida en segundo plano).
  // El PLAN pide que el cambio se note "en segundos", así que preferimos
  // corrección inmediata a velocidad de respuesta.
  revalidateTag("contentful", { expire: 0 });
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
