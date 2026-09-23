import { cn } from "@/lib/cn";

type WashColor = "violet" | "rose" | "ochre" | "teal";

type Stain = {
  color: WashColor;
  /** Lado del cuadrado que ocupa la mancha, en `vw`/`%`/`rem`… */
  size: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  /** `border-radius` asimétrico: la forma de base, antes de suavizar/distorsionar el borde. */
  radius: string;
  opacity: number;
  /** Desenfoque del borde — más grande en las manchas grandes, más pequeño en las chicas. */
  blur: string;
  /**
   * `rough` (por defecto): borde de tinta real, con el filtro SVG que lo
   * ondula de forma irregular — para las manchas grandes, el gesto
   * principal. `soft`: solo `blur`, sin distorsionar — para manchas
   * pequeñas, donde el filtro no ondula el contorno, lo rompe en trocitos
   * sueltos (así se veían los "iconos raros"). Ambas quedan con el borde
   * blando de una acuarela real; ninguna es un punto plano y duro.
   */
  edge?: "rough" | "soft";
  /** Segundos del ciclo de deriva; variarlo entre manchas evita que se muevan al unísono. */
  duration?: number;
  delay?: number;
};

type Props = {
  stains: readonly Stain[];
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
 * Manchas de color en `multiply` sobre el lienzo, como acuarela calando en
 * papel. Puramente decorativa (`aria-hidden`) y sin imágenes: capas de
 * `border-radius` asimétrico + blur, muchas superpuestas de distinto
 * tamaño — una sola mancha grande sola se lee como una forma, la densidad
 * de varias es lo que la hace leerse como pintura.
 */
export function PaintWash({ stains, className, position = "fixed" }: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none inset-0 -z-10 overflow-hidden",
        position === "fixed" ? "fixed" : "absolute",
        className,
      )}
    >
      <PaintTextureFilter />

      {stains.map((stain, index) => (
        <span
          key={index}
          className="absolute"
          style={{
            width: stain.size,
            height: stain.size,
            top: stain.top,
            bottom: stain.bottom,
            left: stain.left,
            right: stain.right,
            borderRadius: stain.radius,
            background: COLOR_VAR[stain.color],
            opacity: stain.opacity,
            filter:
              stain.edge === "soft"
                ? `blur(${stain.blur})`
                : `url(#paint-edge) blur(${stain.blur})`,
            mixBlendMode: "multiply",
            animation: `wash-drift ${stain.duration ?? 24}s ease-in-out infinite`,
            animationDelay: `${stain.delay ?? 0}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Filtro SVG compartido que rompe el contorno liso de cada mancha `rough`
 * en un borde irregular. `width`/`height` en el propio `<filter>` (no solo
 * en `x`/`y`) le dan margen a `feDisplacementMap` para "sangrar" fuera de
 * la caja original sin recortarse. Se define una vez (id fijo): si
 * `<PaintWash>` se usa varias veces en la misma página, todas referencian
 * el mismo filtro sin coste extra.
 *
 * El `feGaussianBlur` antes de desplazar es la parte que importa: sin él,
 * `feDisplacementMap` tira del canal alfa justo en el borde duro de la
 * forma y a veces "arranca" trocitos sueltos en vez de ondular el
 * contorno. Suavizar antes deja un borde de transparencia progresiva para
 * desplazar, sin ese punto de ruptura — y aun así, en formas pequeñas
 * (`edge: "soft"`) ni con esto compensa: se usa solo en las manchas
 * grandes.
 */
function PaintTextureFilter() {
  return (
    <svg aria-hidden className="absolute h-0 w-0">
      <filter
        id="paint-edge"
        x="-30%"
        y="-30%"
        width="160%"
        height="160%"
        colorInterpolationFilters="sRGB"
      >
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="soft" />
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.011"
          numOctaves="3"
          seed="7"
          result="grain"
        />
        <feDisplacementMap
          in="soft"
          in2="grain"
          scale="36"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

/**
 * Backdrop único para todo el sitio (ver `position: "fixed"`): manchas
 * grandes y bien repartidas por el viewport para que el color se note en
 * cualquier página, no solo en un hero. Se monta una vez en el layout raíz.
 */
export const SITE_WASH: readonly Stain[] = [
  {
    color: "violet",
    size: "50vw",
    top: "-18vh",
    left: "-15vw",
    radius: "63% 37% 54% 46% / 55% 48% 52% 45%",
    opacity: 0.3,
    blur: "10px",
    duration: 32,
  },
  {
    color: "ochre",
    size: "38vw",
    top: "-6vh",
    right: "-14vw",
    radius: "37% 63% 56% 44% / 49% 42% 58% 51%",
    opacity: 0.28,
    blur: "12px",
    duration: 36,
    delay: 4,
  },
  {
    color: "rose",
    size: "42vw",
    top: "42vh",
    left: "18vw",
    radius: "50% 50% 34% 66% / 62% 38% 62% 38%",
    opacity: 0.24,
    blur: "14px",
    duration: 28,
    delay: 8,
  },
  {
    color: "teal",
    size: "44vw",
    bottom: "-16vh",
    right: "-12vw",
    radius: "42% 58% 68% 32% / 45% 65% 35% 55%",
    opacity: 0.28,
    blur: "12px",
    duration: 34,
    delay: 2,
  },
  {
    color: "violet",
    size: "30vw",
    bottom: "6vh",
    left: "-10vw",
    radius: "58% 42% 45% 55% / 40% 55% 45% 60%",
    opacity: 0.22,
    blur: "10px",
    duration: 26,
    delay: 10,
  },
];

/**
 * Variante "mancha de esquina": el grueso del color concentrado arriba a
 * la izquierda, como un gesto de pincel — no repartido en 4-5 formas
 * sueltas, sino muchas manchas de distinto tamaño superpuestas (así se lee
 * como acuarela real, con densidad, no como 3 círculos con blur). Dos
 * manchas grandes y muy tenues alargan el gesto hacia el centro y la parte
 * baja, para que el resto del lienzo se sienta acompañado sin dejar de
 * leerse como un gesto en una esquina.
 */
export const CORNER_WASH: readonly Stain[] = [
  // --- Gesto principal: las manchas grandes, con borde de tinta real. ---
  {
    color: "violet",
    size: "42vw",
    top: "-14vh",
    left: "-12vw",
    radius: "63% 37% 54% 46% / 55% 48% 52% 45%",
    opacity: 0.36,
    blur: "7px",
    duration: 30,
  },
  {
    color: "teal",
    size: "32vw",
    top: "6vh",
    left: "9vw",
    radius: "42% 58% 68% 32% / 45% 65% 35% 55%",
    opacity: 0.34,
    blur: "7px",
    duration: 26,
    delay: 3,
  },
  {
    color: "rose",
    size: "27vw",
    top: "27vh",
    left: "-7vw",
    radius: "50% 50% 34% 66% / 62% 38% 62% 38%",
    opacity: 0.32,
    blur: "6px",
    duration: 24,
    delay: 6,
  },
  {
    color: "ochre",
    size: "21vw",
    top: "1vh",
    left: "29vw",
    radius: "37% 63% 56% 44% / 49% 42% 58% 51%",
    opacity: 0.3,
    blur: "6px",
    duration: 22,
    delay: 2,
  },
  // --- Densidad: manchas medianas y pequeñas superpuestas, borde suave. ---
  {
    color: "ochre",
    size: "11vw",
    top: "16vh",
    left: "3vw",
    radius: "55% 45% 40% 60% / 45% 55% 45% 55%",
    opacity: 0.4,
    blur: "3px",
    edge: "soft",
    duration: 20,
    delay: 1,
  },
  {
    color: "teal",
    size: "9vw",
    top: "-3vh",
    left: "23vw",
    radius: "48% 52% 60% 40% / 55% 45% 55% 45%",
    opacity: 0.42,
    blur: "3px",
    edge: "soft",
    duration: 18,
    delay: 5,
  },
  {
    color: "rose",
    size: "8vw",
    top: "35vh",
    left: "17vw",
    radius: "50% 50% 45% 55% / 40% 60% 40% 60%",
    opacity: 0.38,
    blur: "3px",
    edge: "soft",
    duration: 21,
    delay: 4,
  },
  {
    color: "violet",
    size: "7vw",
    top: "11vh",
    left: "36vw",
    radius: "58% 42% 50% 50% / 52% 48% 52% 48%",
    opacity: 0.36,
    blur: "2.5px",
    edge: "soft",
    duration: 19,
    delay: 7,
  },
  {
    color: "ochre",
    size: "6vw",
    top: "31vh",
    left: "-3vw",
    radius: "45% 55% 55% 45% / 50% 50% 50% 50%",
    opacity: 0.38,
    blur: "2.5px",
    edge: "soft",
    duration: 23,
    delay: 8,
  },
  {
    color: "teal",
    size: "10vw",
    top: "21vh",
    left: "29vw",
    radius: "52% 48% 45% 55% / 48% 52% 48% 52%",
    opacity: 0.32,
    blur: "3px",
    edge: "soft",
    duration: 25,
    delay: 3,
  },
  {
    color: "rose",
    size: "5vw",
    top: "3vh",
    left: "12vw",
    radius: "50% 50% 50% 50% / 55% 45% 55% 45%",
    opacity: 0.4,
    blur: "2px",
    edge: "soft",
    duration: 17,
    delay: 6,
  },
  {
    color: "violet",
    size: "5vw",
    top: "40vh",
    left: "6vw",
    radius: "50% 50% 50% 50% / 45% 55% 45% 55%",
    opacity: 0.36,
    blur: "2px",
    edge: "soft",
    duration: 20,
    delay: 9,
  },
  // --- Alcance: dos manchas grandes y muy tenues hacia el centro/abajo. ---
  {
    color: "teal",
    size: "46vw",
    top: "18vh",
    left: "34vw",
    radius: "48% 52% 60% 40% / 55% 45% 55% 45%",
    opacity: 0.14,
    blur: "16px",
    duration: 40,
    delay: 5,
  },
  {
    color: "rose",
    size: "40vw",
    bottom: "-14vh",
    left: "6vw",
    radius: "55% 45% 40% 60% / 45% 55% 45% 55%",
    opacity: 0.13,
    blur: "16px",
    duration: 38,
    delay: 9,
  },
];
