"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Scroll suave para toda la página.
 *
 * `autoRaf` le deja a Lenis su propio bucle de `requestAnimationFrame` y
 * `respectReducedMotion` (activado por defecto) hace que, con
 * `prefers-reduced-motion`, el scroll siga el dispositivo de entrada 1:1 en
 * vez de suavizarse — no hace falta comprobarlo a mano.
 *
 * `anchors: true` es importante: el menú navega con anclas (`/#work`,
 * `/#contact`). Sin esto, un salto a ancla lo resuelve el navegador de
 * forma nativa e instantánea, sin que Lenis se entere — su posición de
 * scroll interna se desincroniza de la real, y el siguiente gesto de
 * scroll parte de ese valor equivocado (se nota como que el scroll se
 * "atasca" y no responde bien). Con `anchors: true`, Lenis intercepta esos
 * saltos y los anima él mismo, así que su estado interno nunca se
 * desincroniza. El `offset` negativo desplaza el destino hacia abajo esa
 * cantidad, para no dejar la sección justo debajo de la cabecera fija.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      stopInertiaOnNavigate: true,
      anchors: { offset: -88 },
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
