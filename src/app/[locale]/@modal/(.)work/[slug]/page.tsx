import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { ProjectModal } from "@/components/work/ProjectModal";
import { getProjectBySlug, getProjects } from "@/lib/contentful/queries";

/**
 * Intercepta la navegación de cliente hacia `/work/[slug]` desde cualquier
 * otro punto de `[locale]` (Home, `/work`…) y la muestra como modal encima
 * de la página de origen, en vez de sustituirla por la página completa. Ver
 * `[locale]/work/[slug]/page.tsx` para esa página completa, que es la que
 * se ve en una entrada directa, una recarga o un enlace compartido.
 */
export default async function InterceptedProjectModal(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const locale = await getLocale();

  const [project, allProjects] = await Promise.all([
    getProjectBySlug(locale, slug),
    getProjects(locale),
  ]);

  if (!project) notFound();

  const index = allProjects.findIndex((item) => item.slug === project.slug);
  const previous = allProjects.at(index - 1) ?? allProjects.at(-1);
  const next = allProjects.at((index + 1) % allProjects.length);

  return (
    <ProjectModal
      project={project}
      previousSlug={previous?.slug ?? project.slug}
      nextSlug={next?.slug ?? project.slug}
    />
  );
}
