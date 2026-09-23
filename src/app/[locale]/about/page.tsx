import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { toLocale } from "@/lib/i18n/routing";
import { getSiteSettings } from "@/lib/contentful/queries";

export async function generateMetadata(
  props: PageProps<"/[locale]/about">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale: toLocale(locale),
    namespace: "about",
  });
  return { title: t("title") };
}

// TODO(azael): Fase 2 — retrato, timelines de experiencia y formación,
// exposiciones filtrables, habilidades y descarga del CV.
export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const settings = await getSiteSettings(locale);

  return (
    <Container as="section" width="narrow" className="py-section">
      <h1 className="font-display text-title">{t("title")}</h1>
      <div className="text-ink-muted mt-10 flex flex-col gap-6 text-lg text-pretty">
        {settings.bioLong.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Container>
  );
}
