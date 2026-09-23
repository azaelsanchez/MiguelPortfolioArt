import type { SocialLinks } from "./contentful/types";

export const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  instagram: "Instagram",
  artstation: "ArtStation",
  vimeo: "Vimeo",
  linkedin: "LinkedIn",
  behance: "Behance",
};

/** Solo las redes que de verdad tienen URL en `SiteSettings`, tipadas sin el `| undefined`. */
export function getActiveSocials(
  socialLinks: SocialLinks,
): Array<[keyof SocialLinks, string]> {
  return (
    Object.entries(socialLinks) as Array<
      [keyof SocialLinks, string | undefined]
    >
  ).filter((entry): entry is [keyof SocialLinks, string] => Boolean(entry[1]));
}
