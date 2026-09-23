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
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, stopInertiaOnNavigate: true });
    return () => lenis.destroy();
  }, []);

  return null;
}
