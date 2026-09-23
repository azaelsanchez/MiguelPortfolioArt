import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { CategoryFilter } from "@/components/work/CategoryFilter";
import { WorkGrid } from "@/components/work/WorkGrid";
import { toLocale } from "@/lib/i18n/routing";
import { buildAlternates } from "@/lib/seo";
import { getCategories, getProjects } from "@/lib/contentful/queries";

export async function generateMetadata(
  props: PageProps<"/[locale]/work">,
): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "work" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/work"),
  };
}

export default async function WorkPage() {
  const locale = await getLocale();
  const t = await getTranslations("work");
  const [projects, categories] = await Promise.all([
    getProjects(locale),
    getCategories(locale),
  ]);

  return (
    <Container as="section" width="wide" className="py-section">
      <h1 className="font-display text-title">{t("title")}</h1>
      <p className="text-ink-muted mt-4 max-w-xl">{t("subtitle")}</p>

      {/* `CategoryFilter` y `WorkGrid` leen `useSearchParams`, que exige un
          límite de Suspense para no forzar el renderizado dinámico de toda
          la página. */}
      <Suspense>
        <div className="mt-10">
          <CategoryFilter categories={categories} />
        </div>
        <WorkGrid projects={projects} />
      </Suspense>
    </Container>
  );
}
