/**
 * Fachada de datos que consumen las páginas.
 *
 * Mientras no haya credenciales de Contentful (`CONTENTFUL_SPACE_ID`), todas
 * las consultas se resuelven contra el adaptador mock. En la Fase 3 se añade
 * aquí la rama que habla con la Delivery/Preview API; la firma no cambia, así
 * que las páginas no se tocan.
 */
import type { Locale } from "../i18n/routing";
import * as mock from "./mock";
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

// TODO(azael): Fase 3 — sustituir por el cliente real cuando haya credenciales.
function assertMock(): void {
  if (!usingMockData) {
    throw new Error(
      "El cliente de Contentful aún no está implementado (Fase 3 del PLAN).",
    );
  }
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  assertMock();
  return mock.getCategories(locale);
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  assertMock();
  return mock.getProjects(locale);
}

export async function getFeaturedProjects(locale: Locale): Promise<Project[]> {
  assertMock();
  return mock.getFeaturedProjects(locale);
}

export async function getProjectSlugs(): Promise<string[]> {
  assertMock();
  return mock.getProjectSlugs();
}

export async function getProjectBySlug(
  locale: Locale,
  slug: string,
): Promise<Project | undefined> {
  assertMock();
  return mock.getProjectBySlug(locale, slug);
}

export async function getExhibitions(locale: Locale): Promise<Exhibition[]> {
  assertMock();
  return mock.getExhibitions(locale);
}

export async function getEducation(locale: Locale): Promise<Education[]> {
  assertMock();
  return mock.getEducation(locale);
}

export async function getExperience(locale: Locale): Promise<Experience[]> {
  assertMock();
  return mock.getExperience(locale);
}

export async function getSkills(locale: Locale): Promise<Skill[]> {
  assertMock();
  return mock.getSkills(locale);
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  assertMock();
  return mock.getSiteSettings(locale);
}
