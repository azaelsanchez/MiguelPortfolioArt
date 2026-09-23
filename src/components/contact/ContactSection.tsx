import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import type { SiteSettings, SocialLinks } from "@/lib/contentful/types";

type Props = {
  settings: SiteSettings;
};

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  instagram: "Instagram",
  artstation: "ArtStation",
  vimeo: "Vimeo",
  linkedin: "LinkedIn",
  behance: "Behance",
};

export async function ContactSection({ settings }: Props) {
  const t = await getTranslations("contact");

  const socials = (
    Object.entries(settings.socialLinks) as Array<
      [keyof SocialLinks, string | undefined]
    >
  ).filter((entry): entry is [keyof SocialLinks, string] => Boolean(entry[1]));

  return (
    <Container
      id="contact"
      as="section"
      width="wide"
      className="py-section scroll-mt-20"
    >
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <Reveal>
            <h2 className="font-display text-title">{t("title")}</h2>
            <p className="text-ink-muted mt-4 max-w-sm">{t("subtitle")}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <a
              href={`mailto:${settings.email}`}
              className="font-display text-heading hover:text-accent mt-10 inline-block transition-colors duration-300 ease-(--ease-out-soft)"
            >
              {settings.email}
            </a>
          </Reveal>

          {socials.length > 0 && (
            <Reveal delay={0.16}>
              <div className="mt-10">
                <p className="eyebrow">{t("followMe")}</p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {socials.map(([key, url]) => (
                    <li key={key}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-ink-muted hover:text-accent text-sm transition-colors duration-300 ease-(--ease-out-soft)"
                      >
                        {SOCIAL_LABELS[key]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Container>
  );
}
