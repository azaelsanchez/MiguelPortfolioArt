import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { FeaturedWorks } from "@/components/home/FeaturedWorks";
import { getFeaturedProjects, getSiteSettings } from "@/lib/contentful/queries";
import { toLocale } from "@/lib/i18n/routing";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  return { alternates: buildAlternates(toLocale(locale), "") };
}

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const tNav = await getTranslations("nav");
  const [settings, featured] = await Promise.all([
    getSiteSettings(locale),
    getFeaturedProjects(locale),
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
            <Link href="/work" className={buttonClasses("solid")}>
              {t("ctaWork")}
            </Link>
            <Link href="/contact" className={buttonClasses("solid")}>
              {tNav("contact")}
            </Link>
          </div>
        </Reveal>
      </Container>

      <Container as="div" width="wide">
        <FeaturedWorks projects={featured} />
      </Container>
    </>
  );
}
