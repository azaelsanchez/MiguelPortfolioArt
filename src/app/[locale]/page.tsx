import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CategoryFilter } from "@/components/work/CategoryFilter";
import { WorkGrid } from "@/components/work/WorkGrid";
import { ContactSection } from "@/components/contact/ContactSection";
import {
  getCategories,
  getProjects,
  getSiteSettings,
} from "@/lib/contentful/queries";
import { toLocale } from "@/lib/i18n/routing";
import { buildAlternates } from "@/lib/seo";

/** Filas de 3 en escritorio antes de necesitar "Mostrar más". */
const INITIAL_VISIBLE = 9;

export async function generateMetadata(
  props: PageProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  return { alternates: buildAlternates(toLocale(locale), "") };
}

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const tWork = await getTranslations("work");
  const tNav = await getTranslations("nav");
  const [settings, projects, categories] = await Promise.all([
    getSiteSettings(locale),
    getProjects(locale),
    getCategories(locale),
  ]);

  return (
    <>
      <Container
        as="section"
        className="py-section flex min-h-[calc(100svh-5rem)] flex-col justify-center"
      >
        <Reveal>
          <p className="eyebrow">{settings.tagline}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="font-display text-hero mt-6 max-w-5xl text-balance">
            Miguel Ángel Gómez Balbuena
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="text-ink-muted mt-8 max-w-2xl text-lg text-pretty">
            {settings.bioShort}
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/#work" className={buttonClasses("solid")}>
              {t("ctaWork")}
            </Link>
            <Link href="/#contact" className={buttonClasses("solid")}>
              {tNav("contact")}
            </Link>
          </div>
        </Reveal>
      </Container>

      <Container
        id="work"
        as="section"
        width="wide"
        className="py-section scroll-mt-20"
      >
        <Reveal>
          <h2 className="font-display text-title">{tWork("title")}</h2>
          <p className="text-ink-muted mt-4 max-w-xl">{tWork("subtitle")}</p>
        </Reveal>

        {/* `CategoryFilter` y `WorkGrid` leen `useSearchParams`, que exige un
            límite de Suspense para no forzar el renderizado dinámico de toda
            la página. */}
        <Suspense>
          <div className="mt-10">
            <CategoryFilter categories={categories} />
          </div>
          <WorkGrid projects={projects} initialCount={INITIAL_VISIBLE} />
        </Suspense>
      </Container>

      <ContactSection settings={settings} />
    </>
  );
}
