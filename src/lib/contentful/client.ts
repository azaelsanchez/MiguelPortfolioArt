import { createClient, type ContentfulClientApi } from "contentful";

let deliveryClient: ContentfulClientApi<undefined> | undefined;
let previewClient: ContentfulClientApi<undefined> | undefined;

function buildClient(preview: boolean): ContentfulClientApi<undefined> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = preview
    ? process.env.CONTENTFUL_PREVIEW_TOKEN
    : process.env.CONTENTFUL_DELIVERY_TOKEN;

  if (!spaceId || !accessToken) {
    throw new Error(
      `Falta ${!spaceId ? "CONTENTFUL_SPACE_ID" : preview ? "CONTENTFUL_PREVIEW_TOKEN" : "CONTENTFUL_DELIVERY_TOKEN"}.`,
    );
  }

  return createClient({
    space: spaceId,
    environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
    accessToken,
    host: preview ? "preview.contentful.com" : undefined,
  });
}

/** Delivery API: solo contenido publicado. Se cachea junto con `unstable_cache` en `queries.ts`. */
export function getDeliveryClient(): ContentfulClientApi<undefined> {
  deliveryClient ??= buildClient(false);
  return deliveryClient;
}

/** Preview API: incluye borradores. Se usa sin caché, solo con el draft mode activo. */
export function getPreviewClient(): ContentfulClientApi<undefined> {
  previewClient ??= buildClient(true);
  return previewClient;
}
