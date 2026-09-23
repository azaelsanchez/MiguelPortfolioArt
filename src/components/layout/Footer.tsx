import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/contentful/queries";
import type { SocialLinks } from "@/lib/contentful/types";

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  instagram: "Instagram",
  artstation: "ArtStation",
  vimeo: "Vimeo",
  linkedin: "LinkedIn",
  behance: "Behance",
};

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const settings = await getSiteSettings(locale);

  const socials = (
    Object.entries(settings.socialLinks) as Array<
      [keyof SocialLinks, string | undefined]
    >
  ).filter((entry): entry is [keyof SocialLinks, string] => Boolean(entry[1]));

  const creditUrl = process.env.NEXT_PUBLIC_DEV_CREDIT_URL;

  return (
    <footer className="border-line mt-auto border-t">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <a
            href={`mailto:${settings.email}`}
            className="font-display text-heading text-ink hover:text-accent transition-colors duration-300 ease-(--ease-out-soft)"
          >
            {settings.email}
          </a>
          <p className="text-ink-muted text-sm">
            © {new Date().getFullYear()} Miguel Ángel Gómez Balbuena.{" "}
            {t("rights")}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          {socials.length > 0 && (
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-ink-muted hover:text-ink text-sm transition-colors duration-300 ease-(--ease-out-soft)"
                  >
                    {SOCIAL_LABELS[key]}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <p className="text-ink-subtle text-xs">
            {t("devCredit")}:{" "}
            {creditUrl ? (
              <a
                href={creditUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-ink transition-colors duration-300 ease-(--ease-out-soft)"
              >
                itsazael.exe
              </a>
            ) : (
              "itsazael.exe"
            )}
          </p>
        </div>
      </Container>
    </footer>
  );
}
