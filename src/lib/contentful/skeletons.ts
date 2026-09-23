/**
 * Formas de los campos de cada content type, tal como llegan de la
 * Delivery/Preview API cuando la consulta lleva un `locale` concreto (así se
 * hace siempre en `queries.ts`): valores ya resueltos a un único idioma, sin
 * el mapa `{ [locale]: valor }` que usa el modo "todos los locales" del SDK.
 *
 * El SDK oficial (`contentful`) tipa sus respuestas de forma genérica para
 * cubrir también ese modo "todos los locales", lo que hace que TypeScript
 * infiera una unión `valor | { [locale]: valor }` incluso cuando en tiempo de
 * ejecución solo puede darse el primer caso. En vez de pelear con esos
 * genéricos, `queries.ts` pide los datos sin tipar y los pasa por un `cast`
 * a estas interfaces en el límite con `mappers.ts`, que es el único sitio
 * que las usa. Ver la sección 3 del PLAN para el modelo completo.
 */
import type { Document as RichTextDocument } from "@contentful/rich-text-types";
export type { RichTextDocument };

/** Entrada mínima que necesitan los mappers: id + campos ya resueltos. */
export type ContentfulEntry<Fields> = {
  sys: { id: string };
  fields: Fields;
};

/** Asset mínimo que necesitan los mappers. */
export type ContentfulAsset = {
  fields: {
    title?: string;
    description?: string;
    file?: {
      url: string;
      details: { image?: { width: number; height: number } };
    };
  };
};

export type CategoryFields = {
  name: string;
  slug: string;
  order: number;
};

export type ProjectFields = {
  title: string;
  slug: string;
  year: number;
  category: ContentfulEntry<CategoryFields>[];
  coverImage: ContentfulAsset;
  gallery?: ContentfulAsset[];
  videoUrl?: string;
  description: RichTextDocument;
  technique?: string;
  dimensions?: string;
  featured: boolean;
  order: number;
};

export type ExhibitionFields = {
  year: number;
  title: string;
  type: "Individual" | "Colectiva";
  venue: string;
  city: string;
  country: string;
  group?: string;
};

export type EducationFields = {
  yearStart: number;
  yearEnd: number;
  title: string;
  institution: string;
};

export type ExperienceFields = {
  role: string;
  organization: string;
  yearStart: number;
  yearEnd?: number;
  highlights: string[];
  order: number;
};

export type SkillFields = {
  name: string;
  type: "Especialidad" | "Herramienta" | "Idioma";
  level?: string;
  order: number;
};

export type SocialLinksField = {
  instagram?: string;
  artstation?: string;
  vimeo?: string;
  linkedin?: string;
  behance?: string;
};

export type SiteSettingsFields = {
  heroVideoUrl?: string;
  heroImage: ContentfulAsset;
  tagline: string;
  bioShort: string;
  bioLong: RichTextDocument;
  portrait: ContentfulAsset;
  cvFile: ContentfulAsset;
  email: string;
  socialLinks: SocialLinksField;
};
