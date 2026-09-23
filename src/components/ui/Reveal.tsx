"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

/** Aparece con un leve desplazamiento hacia arriba al entrar en el viewport. */
export function Reveal({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_SOFT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
