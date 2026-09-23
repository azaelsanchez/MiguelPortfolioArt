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
import { Portrait } from "@/components/home/Portrait";
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
  const tAbout = await getTranslations("about");
  const [settings, projects, categories] = await Promise.all([
    getSiteSettings(locale),
    getProjects(locale),
    getCategories(locale),
  ]);

  return (
    <>
      <Container
        as="section"
        className="py-section grid min-h-[calc(100svh-5rem)] items-center gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16"
      >
        {/* Foto primero en el DOM: en móvil queda arriba, en escritorio a
            la izquierda — orden de lectura "primero la cara, luego quién
            es". */}
        <Reveal className="mx-auto w-full max-w-sm md:mx-0">
          <Portrait portrait={settings.portrait} />
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">{settings.tagline}</p>
          </Reveal>

          <Reveal delay={0.08}>
            {/* Más contenido que `text-hero`: a este ancho, con las 4
                palabras del nombre completo, `text-hero` partía en 3
                líneas y se comía la columna entera. */}
            <h1 className="font-display mt-6 text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[0.98] tracking-[-0.02em] text-balance">
              Miguel Ángel Gómez Balbuena
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-ink-muted mt-6 max-w-xl text-lg text-pretty">
              {settings.bioShort}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/#work" className={buttonClasses("solid")}>
                {t("ctaWork")}
              </Link>
              <Link href="/#contact" className={buttonClasses("solid")}>
                {tNav("contact")}
              </Link>
              <a
                href={settings.cvFileUrl}
                download
                className={buttonClasses("outline")}
              >
                {tAbout("downloadCv")}
              </a>
            </div>
          </Reveal>
        </div>
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
