const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Grano de papel sobre todo el viewport.
 *
 * Ruido generado con un filtro SVG `feTurbulence` (sin descargar ninguna
 * imagen), a una opacidad casi imperceptible y en `multiply`. Es lo que hace
 * que el lienzo deje de leerse como un blanco de interfaz y pase a leerse
 * como papel. Se monta una vez en el layout raíz.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 opacity-[0.035] mix-blend-multiply"
      style={{ backgroundImage: NOISE }}
    />
  );
}
