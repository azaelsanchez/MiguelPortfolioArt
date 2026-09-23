import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type { Block, Inline } from "@contentful/rich-text-types";
import type {
  Category,
  Education,
  Exhibition,
  Experience,
  ImageAsset,
  Project,
  SiteSettings,
  Skill,
  SkillType,
} from "./types";
import type {
  CategoryFields,
  ContentfulAsset,
  ContentfulEntry,
  EducationFields,
  ExhibitionFields,
  ExperienceFields,
  ProjectFields,
  RichTextDocument,
  SiteSettingsFields,
  SkillFields,
} from "./skeletons";

/**
 * Mappers Contentful → tipos de dominio.
 *
 * Es el único módulo que conoce la forma de las entradas de Contentful; todo
 * lo demás (componentes, páginas) solo ve `lib/contentful/types.ts`.
 */

export function assetToImage(
  asset: ContentfulAsset | undefined,
  fallbackAlt: string,
): ImageAsset {
  const file = asset?.fields.file;
  const url = file?.url ? `https:${file.url}` : "";
  const dimensions = file?.details.image;

  return {
    url,
    alt: asset?.fields.description || asset?.fields.title || fallbackAlt,
    width: dimensions?.width ?? 1600,
    height: dimensions?.height ?? 1200,
  };
}

/**
 * Un párrafo por cada nodo de primer nivel del Rich Text.
 *
 * TODO(azael): conserva solo texto plano; si más adelante se necesita
 * negrita/enlaces/listas dentro de la descripción, sustituir por un render
 * real con `@contentful/rich-text-react-renderer`.
 */
export function richTextToParagraphs(
  document: RichTextDocument | undefined,
): string[] {
  if (!document) return [];

  return document.content
    .map((node) =>
      documentToPlainTextString({
        nodeType: "document",
        data: {},
        content: [node as Block | Inline],
      } as RichTextDocument),
    )
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function categoryToDomain(
  entry: ContentfulEntry<CategoryFields>,
): Category {
  return {
    id: entry.sys.id,
    slug: entry.fields.slug,
    name: entry.fields.name,
    order: entry.fields.order,
  };
}

export function projectToDomain(
  entry: ContentfulEntry<ProjectFields>,
): Project {
  const fields = entry.fields;

  return {
    id: entry.sys.id,
    slug: fields.slug,
    title: fields.title,
    year: fields.year,
    categories: (fields.category ?? []).map(categoryToDomain),
    coverImage: assetToImage(fields.coverImage, fields.title),
    gallery: (fields.gallery ?? []).map((asset) =>
      assetToImage(asset, fields.title),
    ),
    videoUrl: fields.videoUrl,
    description: richTextToParagraphs(fields.description),
    technique: fields.technique,
    dimensions: fields.dimensions,
    featured: fields.featured,
    order: fields.order,
  };
}

export function exhibitionToDomain(
  entry: ContentfulEntry<ExhibitionFields>,
): Exhibition {
  const fields = entry.fields;

  return {
    id: entry.sys.id,
    year: fields.year,
    title: fields.title,
    type: fields.type === "Individual" ? "solo" : "group",
    venue: fields.venue,
    city: fields.city,
    country: fields.country,
    group: fields.group,
  };
}

export function educationToDomain(
  entry: ContentfulEntry<EducationFields>,
): Education {
  const fields = entry.fields;

  return {
    id: entry.sys.id,
    yearStart: fields.yearStart,
    yearEnd: fields.yearEnd,
    title: fields.title,
    institution: fields.institution,
  };
}

export function experienceToDomain(
  entry: ContentfulEntry<ExperienceFields>,
): Experience {
  const fields = entry.fields;

  return {
    id: entry.sys.id,
    role: fields.role,
    organization: fields.organization,
    yearStart: fields.yearStart,
    yearEnd: fields.yearEnd ?? null,
    highlights: fields.highlights ?? [],
    order: fields.order,
  };
}

const SKILL_TYPE_MAP: Record<SkillFields["type"], SkillType> = {
  Especialidad: "specialty",
  Herramienta: "tool",
  Idioma: "language",
};

export function skillToDomain(entry: ContentfulEntry<SkillFields>): Skill {
  const fields = entry.fields;

  return {
    id: entry.sys.id,
    name: fields.name,
    type: SKILL_TYPE_MAP[fields.type] ?? "specialty",
    level: fields.level,
    order: fields.order,
  };
}

export function siteSettingsToDomain(
  entry: ContentfulEntry<SiteSettingsFields>,
): SiteSettings {
  const fields = entry.fields;

  return {
    heroVideoUrl: fields.heroVideoUrl,
    heroImage: assetToImage(fields.heroImage, fields.tagline),
    tagline: fields.tagline,
    bioShort: fields.bioShort,
    bioLong: richTextToParagraphs(fields.bioLong),
    portrait: assetToImage(fields.portrait, fields.tagline),
    cvFileUrl: fields.cvFile.fields.file?.url
      ? `https:${fields.cvFile.fields.file.url}`
      : "",
    email: fields.email,
    socialLinks: fields.socialLinks,
  };
}
