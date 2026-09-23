/**
 * Enlaces principales. La clave apunta al namespace `nav` de los mensajes.
 *
 * "Obra" y "Contacto" no son páginas aparte: apuntan a anclas de la Home
 * (`#work`, `#contact`), donde vive la rejilla completa y el formulario.
 */
export const NAV_ITEMS = [
  { href: "/#work", key: "work" },
  { href: "/about", key: "about" },
  { href: "/#contact", key: "contact" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
