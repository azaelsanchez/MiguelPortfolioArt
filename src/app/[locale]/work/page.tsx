import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { toLocale } from "@/lib/i18n/routing";
import { getProjects } from "@/lib/contentful/queries";

export async function generateMetadata(
  props: PageProps<"/[locale]/work">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale: toLocale(locale),
    namespace: "work",
  });
  return { title: t("title"), description: t("subtitle") };
}

// TODO(azael): Fase 2 — rejilla masonry con filtros por categoría en la URL.
export default async function WorkPage() {
  const locale = await getLocale();
  const t = await getTranslations("work");
  const projects = await getProjects(locale);

  return (
    <Container as="section" width="wide" className="py-section">
      <h1 className="font-display text-title">{t("title")}</h1>
      <p className="text-ink-muted mt-4 max-w-xl">{t("subtitle")}</p>

      <ul className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id}>
            <p className="font-display text-heading">{project.title}</p>
            <p className="text-ink-muted mt-1 text-sm">
              {project.year} ·{" "}
              {project.categories.map((category) => category.name).join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
