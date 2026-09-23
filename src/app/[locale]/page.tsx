import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/contentful/queries";

// TODO(azael): Fase 2 — hero con `heroVideoUrl` y rejilla de trabajos destacados.
export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const tNav = await getTranslations("nav");
  const settings = await getSiteSettings(locale);

  return (
    <Container
      as="section"
      className="py-section flex min-h-[calc(100svh-5rem)] flex-col justify-center"
    >
      <p className="eyebrow">{settings.tagline}</p>

      <h1 className="font-display text-hero mt-6 max-w-5xl text-balance">
        Miguel Ángel Gómez Balbuena
      </h1>

      <p className="text-ink-muted mt-8 max-w-2xl text-lg text-pretty">
        {settings.bioShort}
      </p>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/work" className={buttonClasses("solid")}>
          {t("ctaWork")}
        </Link>
        <Link href="/contact" className={buttonClasses("outline")}>
          {tNav("contact")}
        </Link>
      </div>
    </Container>
  );
}
