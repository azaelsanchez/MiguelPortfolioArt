import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { toLocale } from "@/lib/i18n/routing";
import { getSiteSettings } from "@/lib/contentful/queries";

export async function generateMetadata(
  props: PageProps<"/[locale]/contact">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale: toLocale(locale),
    namespace: "contact",
  });
  return { title: t("title"), description: t("subtitle") };
}

// TODO(azael): Fase 4 — formulario con Server Action, Zod, Resend y Turnstile.
export default async function ContactPage() {
  const locale = await getLocale();
  const t = await getTranslations("contact");
  const settings = await getSiteSettings(locale);

  return (
    <Container as="section" width="narrow" className="py-section">
      <h1 className="font-display text-title">{t("title")}</h1>
      <p className="text-ink-muted mt-4">{t("subtitle")}</p>
      <a
        href={`mailto:${settings.email}`}
        className="font-display text-heading hover:text-accent mt-10 inline-block transition-colors duration-300 ease-(--ease-out-soft)"
      >
        {settings.email}
      </a>
    </Container>
  );
}
