/**
 * Fallback del slot `@modal` en carga dura (entrada directa, recarga,
 * enlace compartido): no hay modal que mostrar, así que no se renderiza
 * nada y `[locale]/work/[slug]/page.tsx` se ve como página completa normal.
 */
export default function ModalDefault() {
  return null;
}
