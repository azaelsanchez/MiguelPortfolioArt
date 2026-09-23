/** Enlaces principales. La clave apunta al namespace `nav` de los mensajes. */
export const NAV_ITEMS = [
  { href: "/work", key: "work" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
