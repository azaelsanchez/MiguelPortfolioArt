/**
 * Adaptador de datos mock.
 *
 * Expone la misma interfaz que tendrá el cliente de Contentful (sección 7 del
 * PLAN) para que el desarrollo no dependa de tener credenciales. El inventario
 * procede de la sección 4 del PLAN: web de Wix + CV 2026.
 *
 * TODO(azael): los años, categorías, técnicas y descripciones de los proyectos
 * son provisionales. Hay que validarlos con Miguel o extraerlos con el
 * migrador `wix-to-contentful-migrator`.
 */
import type { Locale } from "../i18n/routing";
import type {
  Category,
  Education,
  Exhibition,
  Experience,
  ImageAsset,
  Project,
  SiteSettings,
  Skill,
} from "./types";

export type Localized<T> = Record<Locale, T>;

export type RawImage = {
  url: string;
  alt: Localized<string>;
  width: number;
  height: number;
};

export type RawCategory = {
  id: string;
  slug: string;
  name: Localized<string>;
  order: number;
};

export type RawProject = {
  id: string;
  slug: string;
  title: Localized<string>;
  year: number;
  categorySlugs: string[];
  coverImage: RawImage;
  gallery: RawImage[];
  videoUrl?: string;
  description: Localized<string[]>;
  technique?: Localized<string>;
  dimensions?: string;
  featured: boolean;
  order: number;
};

function toImage(raw: RawImage, locale: Locale): ImageAsset {
  return {
    url: raw.url,
    alt: raw.alt[locale],
    width: raw.width,
    height: raw.height,
  };
}

/** Placeholder mientras no haya assets reales en Contentful. */
function placeholder(
  name: string,
  width: number,
  height: number,
  alt: Localized<string>,
): RawImage {
  return { url: `/mock/${name}.png`, alt, width, height };
}

export const RAW_CATEGORIES: RawCategory[] = [
  {
    id: "cat-animacion",
    slug: "animacion",
    name: { es: "Animación", en: "Animation" },
    order: 1,
  },
  {
    id: "cat-ilustracion",
    slug: "ilustracion",
    name: { es: "Ilustración", en: "Illustration" },
    order: 2,
  },
  {
    id: "cat-diseno-grafico",
    slug: "diseno-grafico",
    name: { es: "Diseño gráfico", en: "Graphic design" },
    order: 3,
  },
  {
    id: "cat-fotografia",
    slug: "fotografia",
    name: { es: "Fotografía", en: "Photography" },
    order: 4,
  },
  {
    id: "cat-pintura",
    slug: "pintura",
    name: { es: "Pintura y obra plástica", en: "Painting and studio work" },
    order: 5,
  },
];

const PENDING_DESCRIPTION: Localized<string[]> = {
  es: [
    "TODO(azael): descripción pendiente de migrar desde Wix o de redactar con Miguel.",
  ],
  en: [
    "TODO(azael): description pending migration from Wix or to be written with Miguel.",
  ],
};

export const RAW_PROJECTS: RawProject[] = [
  {
    id: "prj-blackout",
    slug: "blackout",
    title: { es: "Blackout", en: "Blackout" },
    year: 2020,
    categorySlugs: ["animacion"],
    coverImage: placeholder("blackout", 1600, 900, {
      es: "Fotograma del cortometraje de animación Blackout",
      en: "Still from the animated short film Blackout",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: { es: "Animación 2D", en: "2D animation" },
    featured: true,
    order: 1,
  },
  {
    id: "prj-cest-tres-excitant",
    slug: "cest-tres-excitant",
    title: { es: "C’est très excitant!", en: "C’est très excitant!" },
    year: 2019,
    categorySlugs: ["ilustracion"],
    coverImage: placeholder("cest-tres-excitant", 1200, 1500, {
      es: "Ilustración de la serie C’est très excitant!",
      en: "Illustration from the series C’est très excitant!",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: { es: "Ilustración digital", en: "Digital illustration" },
    featured: true,
    order: 2,
  },
  {
    id: "prj-pequenas-cosas",
    slug: "pequenas-cosas",
    title: { es: "Pequeñas cosas", en: "Little things" },
    year: 2018,
    categorySlugs: ["ilustracion"],
    coverImage: placeholder("pequenas-cosas", 1400, 1400, {
      es: "Ilustración de la serie Pequeñas cosas",
      en: "Illustration from the series Little things",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: { es: "Técnica mixta", en: "Mixed media" },
    featured: true,
    order: 3,
  },
  {
    id: "prj-atleticos",
    slug: "atleticos-al-nuevo-metropolitano",
    title: {
      es: "Atléticos al nuevo Metropolitano",
      en: "Atléticos to the new Metropolitano",
    },
    year: 2017,
    categorySlugs: ["ilustracion", "diseno-grafico"],
    coverImage: placeholder("atleticos-al-nuevo-metropolitano", 1600, 1067, {
      es: "Ilustración Atléticos al nuevo Metropolitano",
      en: "Illustration Atléticos to the new Metropolitano",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: { es: "Ilustración digital", en: "Digital illustration" },
    featured: true,
    order: 4,
  },
  {
    id: "prj-alices-spaces",
    slug: "alices-spaces",
    title: { es: "Alice’s spaces I y II", en: "Alice’s spaces I and II" },
    year: 2016,
    categorySlugs: ["pintura"],
    coverImage: placeholder("alices-spaces", 1200, 1600, {
      es: "Obra plástica Alice’s spaces",
      en: "Studio work Alice’s spaces",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: { es: "Óleo sobre lienzo", en: "Oil on canvas" },
    dimensions: "100 × 130 cm",
    featured: true,
    order: 5,
  },
  {
    id: "prj-tempus-fugit",
    slug: "tempus-fugit",
    title: { es: "Tempus fugit", en: "Tempus fugit" },
    year: 2016,
    categorySlugs: ["pintura"],
    coverImage: placeholder("tempus-fugit", 1500, 1000, {
      es: "Obra plástica Tempus fugit",
      en: "Studio work Tempus fugit",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: { es: "Técnica mixta sobre tabla", en: "Mixed media on board" },
    featured: true,
    order: 6,
  },
  {
    id: "prj-el-sueno-de-la-razon",
    slug: "el-sueno-de-la-razon",
    title: { es: "El sueño de la razón", en: "The sleep of reason" },
    year: 2015,
    categorySlugs: ["pintura", "ilustracion"],
    coverImage: placeholder("el-sueno-de-la-razon", 1200, 1500, {
      es: "Obra El sueño de la razón",
      en: "Artwork The sleep of reason",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: { es: "Grafito y tinta", en: "Graphite and ink" },
    featured: true,
    order: 7,
  },
  {
    id: "prj-do-not-stop",
    slug: "do-not-stop",
    title: { es: "DO NOT STOP", en: "DO NOT STOP" },
    year: 2015,
    categorySlugs: ["animacion"],
    coverImage: placeholder("do-not-stop", 1600, 900, {
      es: "Fotograma de la pieza animada DO NOT STOP",
      en: "Still from the animated piece DO NOT STOP",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: { es: "Motion graphics", en: "Motion graphics" },
    featured: true,
    order: 8,
  },
  {
    id: "prj-draballoon",
    slug: "draballoon",
    title: { es: "Draballoon", en: "Draballoon" },
    year: 2014,
    categorySlugs: ["animacion", "ilustracion"],
    coverImage: placeholder("draballoon", 1600, 1000, {
      es: "Personaje del proyecto Draballoon",
      en: "Character from the Draballoon project",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: {
      es: "Concept art y animación",
      en: "Concept art and animation",
    },
    featured: false,
    order: 9,
  },
  {
    id: "prj-cubiertos-fusion",
    slug: "cubiertos-fusion",
    title: { es: "Cubiertos fusión", en: "Fusion cutlery" },
    year: 2015,
    categorySlugs: ["diseno-grafico"],
    coverImage: placeholder("cubiertos-fusion", 1400, 1050, {
      es: "Diseño de producto Cubiertos fusión",
      en: "Product design Fusion cutlery",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: { es: "Diseño de producto", en: "Product design" },
    featured: false,
    order: 10,
  },
  {
    id: "prj-hollow-la-cerveza",
    slug: "hollow-la-cerveza",
    title: { es: "Hollow, la cerveza", en: "Hollow, the beer" },
    year: 2017,
    categorySlugs: ["diseno-grafico"],
    coverImage: placeholder("hollow-la-cerveza", 1200, 1600, {
      es: "Identidad y packaging de la cerveza Hollow",
      en: "Branding and packaging for Hollow beer",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: { es: "Branding y packaging", en: "Branding and packaging" },
    featured: false,
    order: 11,
  },
  {
    id: "prj-una-pequena-parte-del-mundo",
    slug: "una-pequena-parte-del-mundo",
    title: {
      es: "Una pequeña parte del mundo",
      en: "A small part of the world",
    },
    year: 2021,
    categorySlugs: ["fotografia"],
    coverImage: placeholder("una-pequena-parte-del-mundo", 1600, 1067, {
      es: "Fotografía de la serie Una pequeña parte del mundo",
      en: "Photograph from the series A small part of the world",
    }),
    gallery: [],
    description: PENDING_DESCRIPTION,
    technique: { es: "Fotografía digital", en: "Digital photography" },
    featured: false,
    order: 12,
  },
];

export type RawExhibition = Omit<Exhibition, "title"> & {
  title: Localized<string>;
};

export const RAW_EXHIBITIONS: RawExhibition[] = [
  {
    id: "exh-2024-agraba",
    year: 2024,
    title: { es: "Colectiva ÁGRABA", en: "ÁGRABA group show" },
    type: "group",
    venue: "Centro Cultural Isabel de Farnesio",
    city: "Aranjuez",
    country: "España",
    group: "ÁGRABA",
  },
  {
    id: "exh-2019-agraba",
    year: 2019,
    title: { es: "Colectiva ÁGRABA", en: "ÁGRABA group show" },
    type: "group",
    venue: "Centro Cultural Isabel de Farnesio",
    city: "Aranjuez",
    country: "España",
    group: "ÁGRABA",
  },
  {
    id: "exh-2017-agraba",
    year: 2017,
    title: { es: "Colectiva ÁGRABA", en: "ÁGRABA group show" },
    type: "group",
    venue: "Centro Cultural Moncloa",
    city: "Madrid",
    country: "España",
    group: "ÁGRABA",
  },
  {
    id: "exh-2017-romero",
    year: 2017,
    title: { es: "Exposición individual", en: "Solo exhibition" },
    type: "solo",
    venue: "Galería Romero",
    city: "Soria",
    country: "España",
  },
  {
    id: "exh-2016-agraba",
    year: 2016,
    title: { es: "Colectiva ÁGRABA", en: "ÁGRABA group show" },
    type: "group",
    venue: "Centro Cultural Julio Cortázar",
    city: "Madrid",
    country: "España",
    group: "ÁGRABA",
  },
  {
    id: "exh-2015-ascoli",
    year: 2015,
    title: { es: "Colectiva ÁGRABA", en: "ÁGRABA group show" },
    type: "group",
    venue: "Palazzo dei Capitani del Popolo",
    city: "Ascoli Piceno",
    country: "Italia",
    group: "ÁGRABA",
  },
  {
    id: "exh-2015-monreal",
    year: 2015,
    title: {
      es: "Colectiva Finitium Madrid",
      en: "Finitium Madrid group show",
    },
    type: "group",
    venue: "Joyería Monreal",
    city: "Soria",
    country: "España",
    group: "Finitium Madrid",
  },
  {
    id: "exh-2014-habana",
    year: 2014,
    title: {
      es: "Colectiva Finitium Madrid",
      en: "Finitium Madrid group show",
    },
    type: "group",
    venue: "Academia Nacional de Bellas Artes San Alejandro",
    city: "La Habana",
    country: "Cuba",
    group: "Finitium Madrid",
  },
  {
    id: "exh-2014-farnesio",
    year: 2014,
    title: {
      es: "Colectiva fin de curso CES Felipe II",
      en: "CES Felipe II end-of-year group show",
    },
    type: "group",
    venue: "Centro Cultural Isabel de Farnesio",
    city: "Aranjuez",
    country: "España",
  },
  {
    id: "exh-2014-romero",
    year: 2014,
    title: {
      es: "Colectiva alumnos CES Felipe II",
      en: "CES Felipe II students group show",
    },
    type: "group",
    venue: "Galería Romero",
    city: "Soria",
    country: "España",
  },
  {
    id: "exh-2014-trapezio",
    year: 2014,
    title: {
      es: "Colectiva de artistas emergentes",
      en: "Emerging artists group show",
    },
    type: "group",
    venue: "Sala Trapezio",
    city: "Madrid",
    country: "España",
  },
];

export type RawEducation = Omit<Education, "title"> & {
  title: Localized<string>;
};

export const RAW_EDUCATION: RawEducation[] = [
  {
    id: "edu-doctorado",
    yearStart: 2015,
    yearEnd: 2024,
    title: { es: "Doctorado en Bellas Artes", en: "PhD in Fine Arts" },
    institution: "Universidad Complutense de Madrid",
  },
  {
    id: "edu-master-diseno",
    yearStart: 2014,
    yearEnd: 2015,
    title: {
      es: "Máster Universitario en Diseño",
      en: "Master’s Degree in Design",
    },
    institution: "Universidad Complutense de Madrid",
  },
  {
    id: "edu-grado-bbaa",
    yearStart: 2010,
    yearEnd: 2014,
    title: { es: "Grado en Bellas Artes", en: "BA in Fine Arts" },
    institution: "Universidad Complutense de Madrid",
  },
  {
    id: "edu-cice",
    yearStart: 2007,
    yearEnd: 2008,
    title: {
      es: "Máster Oficial en Animación 3D, Postproducción y Edición No Lineal",
      en: "Official Master’s in 3D Animation, Post-production and Non-linear Editing",
    },
    institution: "CICE, Madrid",
  },
  {
    id: "edu-esdip",
    yearStart: 2002,
    yearEnd: 2006,
    title: {
      es: "Curso de Realización de Películas de Animación",
      en: "Animated Film Production Course",
    },
    institution: "ESDIP, Madrid",
  },
];

export type RawExperience = Omit<Experience, "role" | "highlights"> & {
  role: Localized<string>;
  highlights: Localized<string[]>;
};

export const RAW_EXPERIENCE: RawExperience[] = [
  {
    id: "exp-uem",
    role: { es: "Profesor universitario", en: "University lecturer" },
    organization: "Universidad Europea de Madrid",
    yearStart: 2024,
    // TODO(azael): confirmar fechas con Miguel; ya no da clase allí.
    yearEnd: 2025,
    highlights: {
      es: [
        "Anatomía e Historia de la Animación (Grado en Animación) y Taller de Narrativas y Recursos Digitales (Grado en Diseño).",
        "Diseño y Gestión del Diseño Gráfico (Máster en Diseño Gráfico).",
        "Dirección de 5 TFM y tutorización de grupos de 20–30 estudiantes.",
      ],
      en: [
        "Anatomy and History of Animation (BA in Animation) and Digital Narratives and Resources Workshop (BA in Design).",
        "Design and Graphic Design Management (MA in Graphic Design).",
        "Supervision of 5 master’s theses and tutoring of groups of 20–30 students.",
      ],
    },
    order: 1,
  },
  {
    id: "exp-freelance",
    role: {
      es: "Diseñador gráfico, ilustrador y creativo freelance",
      en: "Freelance graphic designer, illustrator and creative",
    },
    organization: "Autónomo",
    yearStart: 2016,
    yearEnd: null,
    highlights: {
      es: [
        "Branding e identidad visual: logotipos, campañas, merchandising y cartelería.",
        "Ilustración digital y tradicional; motion graphics y edición de vídeo.",
        "Contenido para redes sociales e IA generativa aplicada a producción visual.",
      ],
      en: [
        "Branding and visual identity: logos, campaigns, merchandising and posters.",
        "Digital and traditional illustration; motion graphics and video editing.",
        "Social media content and generative AI applied to visual production.",
      ],
    },
    order: 2,
  },
  {
    id: "exp-hartford",
    role: { es: "Profesor de talleres formativos", en: "Workshop instructor" },
    organization: "Hartford / Grupo Studium",
    yearStart: 2021,
    yearEnd: null,
    highlights: {
      es: [
        "Talleres de creatividad, dibujo, diseño y manualidades en entornos culturales y educativos.",
      ],
      en: [
        "Creativity, drawing, design and crafts workshops in cultural and educational settings.",
      ],
    },
    order: 3,
  },
  {
    id: "exp-simtec",
    role: { es: "Artista 2D / 3D", en: "2D / 3D artist" },
    organization: "SIMTEC S.L. (SIMUMAK)",
    yearStart: 2015,
    yearEnd: 2015,
    highlights: {
      es: [
        "Diseño de escenarios, objetos y personajes 2D/3D para simuladores de conducción.",
      ],
      en: [
        "Design of 2D/3D environments, props and characters for driving simulators.",
      ],
    },
    order: 4,
  },
  {
    id: "exp-ucm",
    role: { es: "Ayudante de profesor", en: "Teaching assistant" },
    organization: "Universidad Complutense de Madrid",
    yearStart: 2013,
    yearEnd: 2014,
    highlights: {
      es: [
        "Apoyo docente en asignaturas artísticas, corrección y seguimiento de trabajos.",
      ],
      en: [
        "Teaching support in art courses, marking and follow-up of student work.",
      ],
    },
    order: 5,
  },
];

export type RawSkill = Omit<Skill, "name"> & { name: Localized<string> };

function specialty(
  id: string,
  es: string,
  en: string,
  order: number,
): RawSkill {
  return { id, name: { es, en }, type: "specialty", order };
}

function tool(id: string, name: string, order: number): RawSkill {
  return { id, name: { es: name, en: name }, type: "tool", order };
}

export const RAW_SKILLS: RawSkill[] = [
  specialty("skl-direccion", "Dirección creativa", "Creative direction", 1),
  specialty(
    "skl-branding",
    "Branding e identidad visual",
    "Branding and visual identity",
    2,
  ),
  specialty(
    "skl-ilustracion",
    "Ilustración digital y editorial",
    "Digital and editorial illustration",
    3,
  ),
  specialty("skl-motion", "Motion graphics", "Motion graphics", 4),
  specialty(
    "skl-concept",
    "Concept art y narrativa visual",
    "Concept art and visual storytelling",
    5,
  ),
  specialty(
    "skl-audiovisual",
    "Producción audiovisual",
    "Audiovisual production",
    6,
  ),
  specialty(
    "skl-diseno",
    "Diseño gráfico y publicitario",
    "Graphic and advertising design",
    7,
  ),
  specialty("skl-3d", "3D y animación", "3D and animation", 8),
  specialty(
    "skl-docencia",
    "Docencia en diseño y animación",
    "Teaching design and animation",
    9,
  ),
  tool("skl-photoshop", "Photoshop", 10),
  tool("skl-illustrator", "Illustrator", 11),
  tool("skl-indesign", "InDesign", 12),
  tool("skl-after-effects", "After Effects", 13),
  tool("skl-premiere", "Premiere Pro", 14),
  tool("skl-blender", "Blender", 15),
  tool("skl-maya", "Autodesk Maya", 16),
  tool("skl-3dsmax", "3ds Max", 17),
  {
    id: "skl-ia",
    name: {
      es: "IA generativa (imagen y vídeo)",
      en: "Generative AI (image and video)",
    },
    type: "tool",
    order: 18,
  },
  {
    id: "skl-espanol",
    name: { es: "Español", en: "Spanish" },
    type: "language",
    level: "C2",
    order: 19,
  },
  {
    id: "skl-ingles",
    name: { es: "Inglés", en: "English" },
    type: "language",
    level: "B2",
    order: 20,
  },
];

export const RAW_SITE_SETTINGS = {
  // TODO(azael): sustituir por el reel real cuando Miguel lo facilite.
  heroVideoUrl: undefined as string | undefined,
  heroImage: placeholder("hero", 2400, 1350, {
    es: "Detalle de una obra de Miguel Ángel Gómez Balbuena",
    en: "Detail of a work by Miguel Ángel Gómez Balbuena",
  }),
  portrait: placeholder("portrait", 1200, 1500, {
    es: "Retrato de Miguel Ángel Gómez Balbuena",
    en: "Portrait of Miguel Ángel Gómez Balbuena",
  }),
  tagline: {
    es: "Doctor en Bellas Artes · Diseñador y docente creativo",
    en: "PhD in Fine Arts · Designer and creative educator",
  },
  bioShort: {
    es: "Diseñador gráfico, ilustrador y creador audiovisual con sólida formación académica y más de 8 años de experiencia. Especializado en branding, identidad visual, ilustración, motion graphics y docencia universitaria. Combino visión artística, dominio técnico e IA generativa para ofrecer resultados de alto impacto en entornos creativos, educativos y culturales.",
    en: "Graphic designer, illustrator and audiovisual creator with a solid academic background and more than 8 years of experience. Specialised in branding, visual identity, illustration, motion graphics and university teaching. I combine artistic vision, technical craft and generative AI to deliver high-impact results in creative, educational and cultural settings.",
  },
  // TODO(azael): validar con Miguel la bio larga en ES y EN.
  bioLong: {
    es: [
      "Mi trabajo gira en torno a los mundos fantásticos, los sueños y los terrores infantiles, y los usa como lente para mirar de frente a la realidad social que nos rodea.",
      "Soy Doctor en Bellas Artes por la Universidad Complutense de Madrid (2024), donde también me gradué y cursé el Máster en Diseño. Antes me formé en animación 3D y realización de películas de animación en CICE y ESDIP.",
      "Entre 2024 y 2025 fui profesor en la Universidad Europea de Madrid, donde impartí asignaturas de animación y diseño en Grado y Máster y dirigí trabajos de fin de máster. Desde 2016 trabajo como diseñador gráfico, ilustrador y creativo freelance.",
    ],
    en: [
      "My work revolves around fantastical worlds, dreams and childhood fears, and uses them as a lens to look straight at the social reality around us.",
      "I hold a PhD in Fine Arts from Universidad Complutense de Madrid (2024), where I also completed my BA and a Master’s in Design. Before that I trained in 3D animation and animated film production at CICE and ESDIP.",
      "Between 2024 and 2025 I taught at Universidad Europea de Madrid, lecturing on animation and design at both BA and MA level and supervising master’s theses. Since 2016 I have been working as a freelance graphic designer, illustrator and creative.",
    ],
  },
  // TODO(azael): sustituir por el PDF real del CV 2026, uno por idioma.
  cvFileUrl: { es: "/mock/cv-es.pdf", en: "/mock/cv-en.pdf" },
  // TODO(azael): confirmar email de contacto y perfiles sociales con Miguel.
  email: "hola@gomezbalbuena.com",
  socialLinks: {
    instagram: "https://www.instagram.com/",
    artstation: "https://www.artstation.com/",
    vimeo: "https://vimeo.com/",
    linkedin: "https://www.linkedin.com/",
  },
};

function toCategory(raw: RawCategory, locale: Locale): Category {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name[locale],
    order: raw.order,
  };
}

function toProject(raw: RawProject, locale: Locale): Project {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title[locale],
    year: raw.year,
    categories: RAW_CATEGORIES.filter((category) =>
      raw.categorySlugs.includes(category.slug),
    ).map((category) => toCategory(category, locale)),
    coverImage: toImage(raw.coverImage, locale),
    gallery: raw.gallery.map((item) => toImage(item, locale)),
    videoUrl: raw.videoUrl,
    description: raw.description[locale],
    technique: raw.technique?.[locale],
    dimensions: raw.dimensions,
    featured: raw.featured,
    order: raw.order,
  };
}

export function getCategories(locale: Locale): Category[] {
  return [...RAW_CATEGORIES]
    .sort((a, b) => a.order - b.order)
    .map((category) => toCategory(category, locale));
}

export function getProjects(locale: Locale): Project[] {
  return [...RAW_PROJECTS]
    .sort((a, b) => a.order - b.order)
    .map((project) => toProject(project, locale));
}

export function getFeaturedProjects(locale: Locale): Project[] {
  return getProjects(locale).filter((project) => project.featured);
}

export function getProjectSlugs(): string[] {
  return RAW_PROJECTS.map((project) => project.slug);
}

export function getProjectBySlug(
  locale: Locale,
  slug: string,
): Project | undefined {
  const raw = RAW_PROJECTS.find((project) => project.slug === slug);
  return raw ? toProject(raw, locale) : undefined;
}

export function getExhibitions(locale: Locale): Exhibition[] {
  return [...RAW_EXHIBITIONS]
    .sort((a, b) => b.year - a.year)
    .map((raw) => ({ ...raw, title: raw.title[locale] }));
}

export function getEducation(locale: Locale): Education[] {
  return [...RAW_EDUCATION]
    .sort((a, b) => b.yearEnd - a.yearEnd)
    .map((raw) => ({ ...raw, title: raw.title[locale] }));
}

export function getExperience(locale: Locale): Experience[] {
  return [...RAW_EXPERIENCE]
    .sort((a, b) => a.order - b.order)
    .map((raw) => ({
      ...raw,
      role: raw.role[locale],
      highlights: raw.highlights[locale],
    }));
}

export function getSkills(locale: Locale): Skill[] {
  return [...RAW_SKILLS]
    .sort((a, b) => a.order - b.order)
    .map((raw) => ({ ...raw, name: raw.name[locale] }));
}

export function getSiteSettings(locale: Locale): SiteSettings {
  const raw = RAW_SITE_SETTINGS;
  return {
    heroVideoUrl: raw.heroVideoUrl,
    heroImage: toImage(raw.heroImage, locale),
    tagline: raw.tagline[locale],
    bioShort: raw.bioShort[locale],
    bioLong: raw.bioLong[locale],
    portrait: toImage(raw.portrait, locale),
    cvFileUrl: raw.cvFileUrl[locale],
    email: raw.email,
    socialLinks: raw.socialLinks,
  };
}
