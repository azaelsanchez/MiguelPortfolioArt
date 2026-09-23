import { cn } from "@/lib/cn";

type WashColor = "violet" | "rose" | "ochre" | "teal";

type Blob = {
  color: WashColor;
  /** Lado del cuadrado que ocupa la mancha, en `vw`/`%`/`rem`… */
  size: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  /** `border-radius` asimétrico: es lo que le da la forma orgánica. */
  radius: string;
  opacity: number;
  blur: string;
  /** Segundos del ciclo de deriva; variarlo entre manchas evita que se muevan al unísono. */
  duration?: number;
  delay?: number;
};

type Props = {
  blobs: readonly Blob[];
  className?: string;
};

const COLOR_VAR: Record<WashColor, string> = {
  violet: "var(--color-wash-violet)",
  rose: "var(--color-wash-rose)",
  ochre: "var(--color-wash-ochre)",
  teal: "var(--color-wash-teal)",
};

/**
 * Manchas de color difuminadas en `multiply` sobre el lienzo, como tinta
 * calando en papel. Puramente decorativa (`aria-hidden`) y sin imágenes:
 * solo `border-radius` asimétrico + `blur`, para que retocar el color en
 * modo oscuro sea cambiar los tokens `--color-wash-*` de `globals.css`, no
 * este componente.
 *
 * El contenedor que la usa necesita `position: relative` y, si tiene
 * contenido encima, `z-index` en ese contenido (la mancha ya lleva `-z-10`).
 */
export function PaintWash({ blobs, className }: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {blobs.map((blob, index) => (
        <span
          key={index}
          className="absolute"
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            bottom: blob.bottom,
            left: blob.left,
            right: blob.right,
            borderRadius: blob.radius,
            background: COLOR_VAR[blob.color],
            opacity: blob.opacity,
            filter: `blur(${blob.blur})`,
            mixBlendMode: "multiply",
            animation: `wash-drift ${blob.duration ?? 24}s ease-in-out infinite`,
            animationDelay: `${blob.delay ?? 0}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Composiciones reutilizables, pensadas para no repetir números mágicos. */
export const WASH_PRESETS = {
  hero: [
    {
      color: "violet",
      size: "42vw",
      top: "-12%",
      left: "-8%",
      radius: "63% 37% 54% 46% / 55% 48% 52% 45%",
      opacity: 0.22,
      blur: "90px",
      duration: 26,
    },
    {
      color: "ochre",
      size: "30vw",
      top: "8%",
      right: "-6%",
      radius: "37% 63% 56% 44% / 49% 42% 58% 51%",
      opacity: 0.18,
      blur: "80px",
      duration: 30,
      delay: 3,
    },
    {
      color: "rose",
      size: "26vw",
      bottom: "-10%",
      left: "22%",
      radius: "50% 50% 34% 66% / 62% 38% 62% 38%",
      opacity: 0.16,
      blur: "70px",
      duration: 22,
      delay: 6,
    },
  ],
  whisper: [
    {
      color: "teal",
      size: "26vw",
      top: "-14%",
      right: "-10%",
      radius: "42% 58% 68% 32% / 45% 65% 35% 55%",
      opacity: 0.12,
      blur: "90px",
      duration: 28,
    },
    {
      color: "violet",
      size: "20vw",
      bottom: "-16%",
      left: "-8%",
      radius: "63% 37% 54% 46% / 55% 48% 52% 45%",
      opacity: 0.1,
      blur: "80px",
      duration: 24,
      delay: 4,
    },
  ],
} as const satisfies Record<string, readonly Blob[]>;
