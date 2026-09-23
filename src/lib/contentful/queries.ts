/**
 * Fachada de datos que consumen las páginas.
 *
 * Mientras no haya credenciales de Contentful (`CONTENTFUL_SPACE_ID`), todas
 * las consultas se resuelven contra el adaptador mock. Con credenciales,
 * hablan con la Delivery/Preview API a través de `client.ts` y pasan la
 * respuesta por los mappers de `mappers.ts`. La firma no cambia entre un caso
 * y otro, así que las páginas no distinguen de dónde viene el dato.
 *
 * Nota sobre el caché: el SDK oficial de Contentful usa `axios`, no `fetch`,
 * así que el `tags: ['contentful']` de la sección 6 del PLAN no se puede
 * aplicar como opción de `fetch`. En su lugar cada consulta se envuelve con
 * `unstable_cache` (que sí acepta cualquier función asíncrona) con esa misma
 * etiqueta, para que el webhook de `/api/revalidate` pueda invalidarla con
 * `revalidateTag('contentful')`. En draft mode nos saltamos el caché: el
 * borrador tiene que verse al momento.
 *
 * Nota sobre los tipos: el SDK tipa `getEntries` de forma genérica para
 * cubrir también su modo "todos los locales", lo que produce uniones
 * `valor | { [locale]: valor }` aunque aquí siempre se pida un único
 * `locale`. Por eso se llama sin el genérico y el resultado se pasa por
 * `asEntries`/`asEntry`, que lo tratan como lo que realmente es: la forma
 * plana definida en `skeletons.ts`.
 */
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";
import type { Locale } from "../i18n/routing";
import * as mock from "./mock";
import { getDeliveryClient, getPreviewClient } from "./client";
import {
  categoryToDomain,
  educationToDomain,
  exhibitionToDomain,
  experienceToDomain,
  projectToDomain,
  skillToDomain,
  siteSettingsToDomain,
} from "./mappers";
import type {
  CategoryFields,
  ContentfulEntry,
  EducationFields,
  ExhibitionFields,
  ExperienceFields,
  ProjectFields,
  SiteSettingsFields,
  SkillFields,
} from "./skeletons";
import type {
  Category,
  Education,
  Exhibition,
  Experience,
  Project,
  SiteSettings,
  Skill,
} from "./types";

export const usingMockData = !process.env.CONTENTFUL_SPACE_ID;

/** Todas las entradas resuelven referencias de un nivel (p. ej. las categorías de un proyecto). */
const INCLUDE_DEPTH = 2;

function asEntries<Fields>(items: unknown): ContentfulEntry<Fields>[] {
  return items as ContentfulEntry<Fields>[];
}

function asEntry<Fields>(item: unknown): ContentfulEntry<Fields> | undefined {
  return item as ContentfulEntry<Fields> | undefined;
}

/**
 * Ejecuta `fetcher` a través de la Preview API sin caché si el draft mode
 * está activo, o a través de la Delivery API con `unstable_cache` en caso
 * contrario. `keyParts` identifica la consulta dentro del caché de Next.
 */
async function withPreviewOrCache<Args extends unknown[], Result>(
  keyParts: string[],
  fetcher: (
    client: ReturnType<typeof getDeliveryClient>,
    ...args: Args
  ) => Promise<Result>,
  ...args: Args
): Promise<Result> {
  const { isEnabled: preview } = await draftMode();

  if (preview) {
    return fetcher(getPreviewClient(), ...args);
  }

  const cached = unstable_cache(
    (...cachedArgs: Args) => fetcher(getDeliveryClient(), ...cachedArgs),
    keyParts,
    { tags: ["contentful"] },
  );
  return cached(...args);
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  if (usingMockData) return mock.getCategories(locale);

  const items = await withPreviewOrCache(
    ["contentful", "categories", locale],
    async (client, locale: Locale) => {
      const { items } = await client.getEntries({
        content_type: "category",
        locale,
        order: ["fields.order"],
      });
      return asEntries<CategoryFields>(items);
    },
    locale,
  );
  return items.map(categoryToDomain);
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  if (usingMockData) return mock.getProjects(locale);

  const items = await withPreviewOrCache(
    ["contentful", "projects", locale],
    async (client, locale: Locale) => {
      const { items } = await client.getEntries({
        content_type: "project",
        locale,
        order: ["fields.order"],
        include: INCLUDE_DEPTH,
      });
      return asEntries<ProjectFields>(items);
    },
    locale,
  );
  return items.map(projectToDomain);
}

export async function getFeaturedProjects(locale: Locale): Promise<Project[]> {
  if (usingMockData) return mock.getFeaturedProjects(locale);

  const items = await withPreviewOrCache(
    ["contentful", "projects-featured", locale],
    async (client, locale: Locale) => {
      const { items } = await client.getEntries({
        content_type: "project",
        locale,
        order: ["fields.order"],
        include: INCLUDE_DEPTH,
        "fields.featured": true,
      });
      return asEntries<ProjectFields>(items);
    },
    locale,
  );
  return items.map(projectToDomain);
}

export async function getProjectSlugs(): Promise<string[]> {
  if (usingMockData) return mock.getProjectSlugs();

  const items = await withPreviewOrCache(
    ["contentful", "project-slugs"],
    async (client) => {
      const { items } = await client.getEntries({
        content_type: "project",
        select: ["fields.slug"],
      });
      return asEntries<Pick<ProjectFields, "slug">>(items);
    },
  );
  return items.map((item) => item.fields.slug);
}

export async function getProjectBySlug(
  locale: Locale,
  slug: string,
): Promise<Project | undefined> {
  if (usingMockData) return mock.getProjectBySlug(locale, slug);

  const items = await withPreviewOrCache(
    ["contentful", "project", locale, slug],
    async (client, locale: Locale, slug: string) => {
      const { items } = await client.getEntries({
        content_type: "project",
        locale,
        include: INCLUDE_DEPTH,
        limit: 1,
        "fields.slug": slug,
      });
      return asEntries<ProjectFields>(items);
    },
    locale,
    slug,
  );
  return items[0] ? projectToDomain(items[0]) : undefined;
}

export async function getExhibitions(locale: Locale): Promise<Exhibition[]> {
  if (usingMockData) return mock.getExhibitions(locale);

  const items = await withPreviewOrCache(
    ["contentful", "exhibitions", locale],
    async (client, locale: Locale) => {
      const { items } = await client.getEntries({
        content_type: "exhibition",
        locale,
        order: ["-fields.year"],
      });
      return asEntries<ExhibitionFields>(items);
    },
    locale,
  );
  return items.map(exhibitionToDomain);
}

export async function getEducation(locale: Locale): Promise<Education[]> {
  if (usingMockData) return mock.getEducation(locale);

  const items = await withPreviewOrCache(
    ["contentful", "education", locale],
    async (client, locale: Locale) => {
      const { items } = await client.getEntries({
        content_type: "education",
        locale,
        order: ["-fields.yearEnd"],
      });
      return asEntries<EducationFields>(items);
    },
    locale,
  );
  return items.map(educationToDomain);
}

export async function getExperience(locale: Locale): Promise<Experience[]> {
  if (usingMockData) return mock.getExperience(locale);

  const items = await withPreviewOrCache(
    ["contentful", "experience", locale],
    async (client, locale: Locale) => {
      const { items } = await client.getEntries({
        content_type: "experience",
        locale,
        order: ["fields.order"],
      });
      return asEntries<ExperienceFields>(items);
    },
    locale,
  );
  return items.map(experienceToDomain);
}

export async function getSkills(locale: Locale): Promise<Skill[]> {
  if (usingMockData) return mock.getSkills(locale);

  const items = await withPreviewOrCache(
    ["contentful", "skills", locale],
    async (client, locale: Locale) => {
      const { items } = await client.getEntries({
        content_type: "skill",
        locale,
        order: ["fields.order"],
      });
      return asEntries<SkillFields>(items);
    },
    locale,
  );
  return items.map(skillToDomain);
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  if (usingMockData) return mock.getSiteSettings(locale);

  const entry = await withPreviewOrCache(
    ["contentful", "site-settings", locale],
    async (client, locale: Locale) => {
      const { items } = await client.getEntries({
        content_type: "siteSettings",
        locale,
        include: INCLUDE_DEPTH,
        limit: 1,
      });
      return asEntry<SiteSettingsFields>(items[0]);
    },
    locale,
  );

  if (!entry) {
    throw new Error(
      "No hay ninguna entrada de SiteSettings publicada en Contentful.",
    );
  }
  return siteSettingsToDomain(entry);
}
