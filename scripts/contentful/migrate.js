/**
 * Migración del modelo de contenido — sección 3 del PLAN.
 *
 * `contentful-migration` no publica tipos de TypeScript, así que este script
 * va en JS plano (no lo recoge `pnpm typecheck`, que solo mira `**\/*.ts`).
 *
 * Uso (necesita CONTENTFUL_MANAGEMENT_TOKEN, nunca en Vercel):
 *   pnpm dlx contentful-migration \
 *     --space-id "$CONTENTFUL_SPACE_ID" \
 *     --environment-id "${CONTENTFUL_ENVIRONMENT:-master}" \
 *     --access-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
 *     scripts/contentful/migrate.js
 *
 * Añade `--yes` para saltarte la confirmación interactiva en CI.
 *
 * Los locales no se crean desde aquí: hazlo una vez, antes de correr esta
 * migración, con `contentful space locale create` o desde Settings → Locales
 * en la UI de Contentful. Los códigos tienen que ser exactamente `es`
 * (locale por defecto del espacio) y `en` — no `es-ES` ni `en-US` — porque
 * `lib/contentful/queries.ts` pide el contenido con `locale: "es" | "en"`,
 * tal cual están definidos en `lib/i18n/routing.ts`.
 */

/** Crea un campo de texto corto localizado en los dos idiomas del sitio. */
function localizedSymbol(contentType, id, name, opts = {}) {
  contentType
    .createField(id)
    .name(name)
    .type("Symbol")
    .localized(true)
    .required(opts.required ?? false);
}

module.exports = function migrate(migration) {
  // --- Category --------------------------------------------------------
  const category = migration.createContentType("category", {
    name: "Categoría",
    description:
      "Categorías de la obra: Animación, Ilustración, Diseño gráfico, Fotografía, Pintura/Obra plástica.",
    displayField: "name",
  });
  localizedSymbol(category, "name", "Nombre", { required: true });
  category
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);
  category.createField("order").name("Orden").type("Integer").required(true);

  // --- Project -----------------------------------------------------------
  const project = migration.createContentType("project", {
    name: "Proyecto",
    displayField: "title",
  });
  localizedSymbol(project, "title", "Título", { required: true });
  project
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);
  project.createField("year").name("Año").type("Integer").required(true);
  project
    .createField("category")
    .name("Categorías")
    .type("Array")
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: ["category"] }],
    })
    .required(true);
  project
    .createField("coverImage")
    .name("Imagen de portada")
    .type("Link")
    .linkType("Asset")
    .required(true);
  project
    .createField("gallery")
    .name("Galería")
    .type("Array")
    .items({ type: "Link", linkType: "Asset" });
  project
    .createField("videoUrl")
    .name("URL del vídeo (Vimeo/YouTube)")
    .type("Symbol");
  project
    .createField("description")
    .name("Descripción")
    .type("RichText")
    .localized(true)
    .required(true);
  localizedSymbol(project, "technique", "Técnica");
  project.createField("dimensions").name("Dimensiones").type("Symbol");
  project
    .createField("featured")
    .name("Destacado en portada")
    .type("Boolean")
    .required(true)
    .defaultValue({ "en-US": false });
  project.createField("order").name("Orden").type("Integer").required(true);

  // --- Exhibition ----------------------------------------------------------
  const exhibition = migration.createContentType("exhibition", {
    name: "Exposición",
    displayField: "title",
  });
  exhibition.createField("year").name("Año").type("Integer").required(true);
  localizedSymbol(exhibition, "title", "Título", { required: true });
  exhibition
    .createField("type")
    .name("Tipo")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["Individual", "Colectiva"] }]);
  exhibition
    .createField("venue")
    .name("Sala / Espacio")
    .type("Symbol")
    .required(true);
  exhibition.createField("city").name("Ciudad").type("Symbol").required(true);
  exhibition.createField("country").name("País").type("Symbol").required(true);
  exhibition
    .createField("group")
    .name("Colectivo (p. ej. ÁGRABA)")
    .type("Symbol");

  // --- Education -----------------------------------------------------------
  const education = migration.createContentType("education", {
    name: "Formación",
    displayField: "title",
  });
  education
    .createField("yearStart")
    .name("Año de inicio")
    .type("Integer")
    .required(true);
  education
    .createField("yearEnd")
    .name("Año de fin")
    .type("Integer")
    .required(true);
  localizedSymbol(education, "title", "Titulación", { required: true });
  education
    .createField("institution")
    .name("Institución")
    .type("Symbol")
    .required(true);

  // --- Experience ----------------------------------------------------------
  const experience = migration.createContentType("experience", {
    name: "Experiencia",
    displayField: "role",
  });
  localizedSymbol(experience, "role", "Puesto", { required: true });
  experience
    .createField("organization")
    .name("Organización")
    .type("Symbol")
    .required(true);
  experience
    .createField("yearStart")
    .name("Año de inicio")
    .type("Integer")
    .required(true);
  experience
    .createField("yearEnd")
    .name("Año de fin (vacío = Actualidad)")
    .type("Integer");
  experience
    .createField("highlights")
    .name("Puntos destacados")
    .type("Array")
    .items({ type: "Symbol" })
    .localized(true);
  experience.createField("order").name("Orden").type("Integer").required(true);

  // --- Skill -----------------------------------------------------------------
  const skill = migration.createContentType("skill", {
    name: "Habilidad",
    displayField: "name",
  });
  localizedSymbol(skill, "name", "Nombre", { required: true });
  skill
    .createField("type")
    .name("Tipo")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["Especialidad", "Herramienta", "Idioma"] }]);
  skill.createField("level").name("Nivel (p. ej. B2)").type("Symbol");
  skill.createField("order").name("Orden").type("Integer").required(true);

  // --- SiteSettings (singleton) ---------------------------------------------
  const siteSettings = migration.createContentType("siteSettings", {
    name: "Ajustes del sitio",
    description: "Entrada única: portada, perfil y contacto.",
    displayField: "tagline",
  });
  siteSettings
    .createField("heroVideoUrl")
    .name("Vídeo de portada (URL)")
    .type("Symbol");
  siteSettings
    .createField("heroImage")
    .name("Imagen de portada (fallback)")
    .type("Link")
    .linkType("Asset")
    .required(true);
  localizedSymbol(siteSettings, "tagline", "Tagline", { required: true });
  siteSettings
    .createField("bioShort")
    .name("Bio corta")
    .type("Text")
    .localized(true)
    .required(true);
  siteSettings
    .createField("bioLong")
    .name("Bio larga")
    .type("RichText")
    .localized(true)
    .required(true);
  siteSettings
    .createField("portrait")
    .name("Retrato")
    .type("Link")
    .linkType("Asset")
    .required(true);
  siteSettings
    .createField("cvFile")
    .name("CV (PDF, por idioma)")
    .type("Link")
    .linkType("Asset")
    .localized(true)
    .required(true);
  siteSettings
    .createField("email")
    .name("Email de contacto")
    .type("Symbol")
    .required(true);
  siteSettings
    .createField("socialLinks")
    .name(
      "Redes sociales (JSON: instagram, artstation, vimeo, linkedin, behance)",
    )
    .type("Object");
};
