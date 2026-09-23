/**
 * Seed del contenido inicial — reutiliza el inventario de
 * `src/lib/contentful/mock.ts` (sección 4 del PLAN) para no mantener los
 * mismos datos escritos dos veces.
 *
 * Requiere que `scripts/contentful/migrate.js` ya se haya corrido (el
 * modelo de contenido tiene que existir) y `CONTENTFUL_MANAGEMENT_TOKEN` en
 * el entorno (nunca en Vercel; solo para scripts locales).
 *
 * Uso:
 *   pnpm tsx scripts/contentful/seed.ts
 *
 * Categorías, exposiciones, formación, experiencia y habilidades se crean y
 * publican directamente: no dependen de ningún asset. Proyectos y
 * SiteSettings sí llevan imágenes obligatorias (portada, retrato, CV) que
 * este script no puede inventarse — Wix las sirve redimensionadas y el CV
 * real aún no existe —, así que esos dos se dejan como borrador con un
 * TODO(azael) y hay que completarlos y publicarlos a mano desde la UI de
 * Contentful.
 */
import { createClient } from "contentful-management";
import {
  RAW_CATEGORIES,
  RAW_EDUCATION,
  RAW_EXHIBITIONS,
  RAW_EXPERIENCE,
  RAW_PROJECTS,
  RAW_SITE_SETTINGS,
  RAW_SKILLS,
  type Localized,
} from "../../src/lib/contentful/mock";

const DEFAULT_LOCALE = "es";

/** Envuelve un valor en el formato `{ locale: valor }` que pide la Management API. */
function field<T>(value: T | Localized<T>): Record<string, T> {
  if (
    typeof value === "object" &&
    value !== null &&
    "es" in (value as Record<string, unknown>) &&
    "en" in (value as Record<string, unknown>)
  ) {
    return value as Localized<T>;
  }
  return { [DEFAULT_LOCALE]: value as T };
}

async function main() {
  const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

  if (!managementToken || !spaceId) {
    console.error(
      "Faltan CONTENTFUL_MANAGEMENT_TOKEN y/o CONTENTFUL_SPACE_ID en el entorno.",
    );
    process.exit(1);
  }

  const client = createClient(
    { accessToken: managementToken },
    { type: "plain", defaults: { spaceId, environmentId } },
  );

  const draftIds: string[] = [];

  async function createAndPublish(
    contentTypeId: string,
    entryId: string,
    fields: Record<string, unknown>,
  ) {
    const entry = await client.entry.createWithId(
      { entryId, contentTypeId },
      { fields },
    );
    await client.entry.publish({ entryId }, entry);
    console.log(`✓ ${contentTypeId}/${entryId} publicado`);
  }

  async function createDraft(
    contentTypeId: string,
    entryId: string,
    fields: Record<string, unknown>,
  ) {
    await client.entry.createWithId({ entryId, contentTypeId }, { fields });
    draftIds.push(`${contentTypeId}/${entryId}`);
    console.log(
      `… ${contentTypeId}/${entryId} creado como borrador (faltan assets)`,
    );
  }

  console.log("Categorías…");
  for (const category of RAW_CATEGORIES) {
    await createAndPublish("category", category.id, {
      name: field(category.name),
      slug: field(category.slug),
      order: field(category.order),
    });
  }

  console.log("Exposiciones…");
  for (const exhibition of RAW_EXHIBITIONS) {
    await createAndPublish("exhibition", exhibition.id, {
      year: field(exhibition.year),
      title: field(exhibition.title),
      type: field(exhibition.type === "solo" ? "Individual" : "Colectiva"),
      venue: field(exhibition.venue),
      city: field(exhibition.city),
      country: field(exhibition.country),
      ...(exhibition.group ? { group: field(exhibition.group) } : {}),
    });
  }

  console.log("Formación…");
  for (const education of RAW_EDUCATION) {
    await createAndPublish("education", education.id, {
      yearStart: field(education.yearStart),
      yearEnd: field(education.yearEnd),
      title: field(education.title),
      institution: field(education.institution),
    });
  }

  console.log("Experiencia…");
  for (const experience of RAW_EXPERIENCE) {
    await createAndPublish("experience", experience.id, {
      role: field(experience.role),
      organization: field(experience.organization),
      yearStart: field(experience.yearStart),
      ...(experience.yearEnd !== null
        ? { yearEnd: field(experience.yearEnd) }
        : {}),
      highlights: field(experience.highlights),
      order: field(experience.order),
    });
  }

  console.log("Habilidades…");
  const SKILL_TYPE_LABEL = {
    specialty: "Especialidad",
    tool: "Herramienta",
    language: "Idioma",
  } as const;
  for (const skill of RAW_SKILLS) {
    await createAndPublish("skill", skill.id, {
      name: field(skill.name),
      type: field(SKILL_TYPE_LABEL[skill.type]),
      ...(skill.level ? { level: field(skill.level) } : {}),
      order: field(skill.order),
    });
  }

  console.log("Proyectos (borrador, sin imágenes)…");
  for (const project of RAW_PROJECTS) {
    await createDraft("project", project.id, {
      title: field(project.title),
      slug: field(project.slug),
      year: field(project.year),
      category: field(
        project.categorySlugs.map((slug) => ({
          sys: {
            type: "Link",
            linkType: "Entry",
            id: RAW_CATEGORIES.find((category) => category.slug === slug)!.id,
          },
        })),
      ),
      // TODO(azael): coverImage/gallery — subir la obra real y enlazarla.
      ...(project.videoUrl ? { videoUrl: field(project.videoUrl) } : {}),
      description: field({
        es: toRichText(project.description.es),
        en: toRichText(project.description.en),
      }),
      ...(project.technique ? { technique: field(project.technique) } : {}),
      ...(project.dimensions ? { dimensions: field(project.dimensions) } : {}),
      featured: field(project.featured),
      order: field(project.order),
    });
  }

  console.log("SiteSettings (borrador, sin imágenes ni CV)…");
  await createDraft("siteSettings", "site-settings", {
    ...(RAW_SITE_SETTINGS.heroVideoUrl
      ? { heroVideoUrl: field(RAW_SITE_SETTINGS.heroVideoUrl) }
      : {}),
    // TODO(azael): heroImage/portrait/cvFile — subir retrato, portada y el CV en PDF.
    tagline: field(RAW_SITE_SETTINGS.tagline),
    bioShort: field(RAW_SITE_SETTINGS.bioShort),
    bioLong: field({
      es: toRichText(RAW_SITE_SETTINGS.bioLong.es),
      en: toRichText(RAW_SITE_SETTINGS.bioLong.en),
    }),
    email: field(RAW_SITE_SETTINGS.email),
    socialLinks: field(RAW_SITE_SETTINGS.socialLinks),
  });

  if (draftIds.length > 0) {
    console.log(
      "\nEntradas creadas como borrador (les falta al menos un asset obligatorio):",
    );
    for (const id of draftIds) console.log(`  - ${id}`);
    console.log(
      "Sube las imágenes/el CV desde la UI de Contentful, enlázalas en cada entrada y publica.",
    );
  }
}

/** Documento Rich Text mínimo: un nodo "paragraph" por cada string del array. */
function toRichText(paragraphs: string[]) {
  return {
    nodeType: "document",
    data: {},
    content: paragraphs.map((text) => ({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: text, marks: [], data: {} }],
    })),
  };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
