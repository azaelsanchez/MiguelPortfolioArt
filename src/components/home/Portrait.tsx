import Image from "next/image";
import type { ImageAsset } from "@/lib/contentful/types";

/**
 * El mismo `border-radius` asimétrico que usan las manchas de `PaintWash`
 * — no un rectángulo — para que el retrato se lea como parte de la misma
 * identidad visual "mancha de tinta", no como una tarjeta de interfaz.
 *
 * La esquina superior izquierda queda deliberadamente más recta (38%/42%
 * en vez de un valor tan agresivo como el resto): es donde cae la cabeza
 * en el retrato, y con más redondeo se la comía.
 */
const BLOB_RADIUS = "38% 62% 55% 45% / 42% 58% 62% 38%";

type Props = {
  portrait: ImageAsset;
};

export function Portrait({ portrait }: Props) {
  return (
    <div
      className="bg-canvas-sunken relative aspect-[4/5] w-full overflow-hidden"
      style={{ borderRadius: BLOB_RADIUS }}
    >
      <Image
        src={portrait.url}
        alt={portrait.alt}
        fill
        sizes="(min-width: 768px) 32vw, 80vw"
        priority
        // TODO(azael): ajuste manual del encuadre — si la cabeza sigue
        // pegada a algún borde, retocar estos porcentajes.
        style={{ objectPosition: "62% 22%" }}
        className="object-cover"
      />
    </div>
  );
}
