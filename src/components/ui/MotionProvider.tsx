"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * `reducedMotion="user"` hace que Motion respete `prefers-reduced-motion` de
 * forma global: con la preferencia activada, cambia transforms y layout
 * animations por saltos instantáneos en todos los componentes de Motion sin
 * que cada uno tenga que comprobarlo.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
