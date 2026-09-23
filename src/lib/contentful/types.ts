/**
 * Tipos de dominio. Los componentes solo consumen estos tipos: los mappers de
 * Contentful (y el adaptador mock) son los únicos que conocen la forma del CMS.
 */

export type ImageAsset = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  order: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  year: number;
  categories: Category[];
  coverImage: ImageAsset;
  gallery: ImageAsset[];
  videoUrl?: string;
  /** Párrafos de la descripción. En Contentful será Rich Text. */
  description: string[];
  technique?: string;
  dimensions?: string;
  featured: boolean;
  order: number;
};

export type ExhibitionType = "solo" | "group";

export type Exhibition = {
  id: string;
  year: number;
  title: string;
  type: ExhibitionType;
  venue: string;
  city: string;
  country: string;
  /** Colectivo con el que se expuso, p. ej. ÁGRABA o Finitium Madrid. */
  group?: string;
};

export type Education = {
  id: string;
  yearStart: number;
  yearEnd: number;
  title: string;
  institution: string;
};

export type Experience = {
  id: string;
  role: string;
  organization: string;
  yearStart: number;
  /** `null` significa "Actualidad". */
  yearEnd: number | null;
  highlights: string[];
  order: number;
};

export type SkillType = "specialty" | "tool" | "language";

export type Skill = {
  id: string;
  name: string;
  type: SkillType;
  level?: string;
  order: number;
};

export type SocialLinks = {
  instagram?: string;
  artstation?: string;
  vimeo?: string;
  linkedin?: string;
  behance?: string;
};

export type SiteSettings = {
  heroVideoUrl?: string;
  heroImage: ImageAsset;
  tagline: string;
  bioShort: string;
  /** Párrafos de la bio larga. En Contentful será Rich Text. */
  bioLong: string[];
  portrait: ImageAsset;
  cvFileUrl: string;
  email: string;
  socialLinks: SocialLinks;
};
