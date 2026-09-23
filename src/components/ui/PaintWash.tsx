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
  /**
   * `fixed`: cubre el viewport entero y no se mueve con el scroll — es lo
   * que usa el layout raíz para que el sitio entero tenga color debajo,
   * nunca solo un recuadro dentro del `Container`. `absolute`: se ancla al
   * contenedor con `position: relative` más cercano, para una mancha local.
   */
  position?: "fixed" | "absolute";
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
 */
export function PaintWash({ blobs, className, position = "fixed" }: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none inset-0 -z-10 overflow-hidden",
        position === "fixed" ? "fixed" : "absolute",
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

/**
 * Backdrop único para todo el sitio (ver `position: "fixed"`): manchas
 * grandes y bien repartidas por el viewport para que el color se note en
 * cualquier página, no solo en un hero. Se monta una vez en el layout raíz.
 */
export const SITE_WASH: readonly Blob[] = [
  {
    color: "violet",
    size: "55vw",
    top: "-18vh",
    left: "-15vw",
    radius: "63% 37% 54% 46% / 55% 48% 52% 45%",
    opacity: 0.42,
    blur: "90px",
    duration: 32,
  },
  {
    color: "ochre",
    size: "42vw",
    top: "-6vh",
    right: "-14vw",
    radius: "37% 63% 56% 44% / 49% 42% 58% 51%",
    opacity: 0.4,
    blur: "85px",
    duration: 36,
    delay: 4,
  },
  {
    color: "rose",
    size: "46vw",
    top: "42vh",
    left: "18vw",
    radius: "50% 50% 34% 66% / 62% 38% 62% 38%",
    opacity: 0.34,
    blur: "100px",
    duration: 28,
    delay: 8,
  },
  {
    color: "teal",
    size: "48vw",
    bottom: "-16vh",
    right: "-12vw",
    radius: "42% 58% 68% 32% / 45% 65% 35% 55%",
    opacity: 0.4,
    blur: "95px",
    duration: 34,
    delay: 2,
  },
  {
    color: "violet",
    size: "34vw",
    bottom: "6vh",
    left: "-10vw",
    radius: "58% 42% 45% 55% / 40% 55% 45% 60%",
    opacity: 0.3,
    blur: "80px",
    duration: 26,
    delay: 10,
  },
];
