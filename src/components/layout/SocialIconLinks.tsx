import { SocialIcon } from "@/components/ui/SocialIcon";
import { SOCIAL_LABELS, getActiveSocials } from "@/lib/social";
import type { SocialLinks } from "@/lib/contentful/types";

type Props = {
  socialLinks: SocialLinks;
  className?: string;
};

/** Fila de icono de marca por red, usada en la cabecera y en el menú móvil. */
export function SocialIconLinks({ socialLinks, className }: Props) {
  const socials = getActiveSocials(socialLinks);
  if (socials.length === 0) return null;

  return (
    <ul className={className}>
      {socials.map(([key, url]) => (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={SOCIAL_LABELS[key]}
            className="text-ink-muted hover:text-accent -m-1.5 block p-1.5 transition-colors duration-300 ease-(--ease-out-soft)"
          >
            <SocialIcon platform={key} className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
