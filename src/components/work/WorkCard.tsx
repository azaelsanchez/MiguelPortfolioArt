import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/contentful/types";

type Props = {
  project: Project;
  sizes?: string;
  priority?: boolean;
  /**
   * Clase de proporción fija (p. ej. `"aspect-[4/5]"`) para recortar la
   * portada con `object-cover`, como en la rejilla uniforme de Home. Sin
   * esto, la imagen mantiene su proporción real y decide la altura de la
   * tarjeta (rejilla masonry de `/work`).
   */
  aspect?: string;
};

export function WorkCard({
  project,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  aspect,
}: Props) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn("group block", !aspect && "mb-8 break-inside-avoid")}
    >
      <div
        className={cn(
          "bg-canvas-sunken overflow-hidden",
          aspect ? cn("relative w-full", aspect) : undefined,
        )}
      >
        <Image
          src={project.coverImage.url}
          alt={project.coverImage.alt}
          width={aspect ? undefined : project.coverImage.width}
          height={aspect ? undefined : project.coverImage.height}
          fill={Boolean(aspect)}
          sizes={sizes}
          priority={priority}
          className={cn(
            "transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.02]",
            aspect ? "object-cover" : "h-auto w-full",
          )}
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <p className="font-display text-ink text-lg">{project.title}</p>
        <p className="text-ink-subtle shrink-0 text-sm">{project.year}</p>
      </div>
      {project.categories.length > 0 && (
        <p className="text-ink-muted mt-0.5 text-sm">
          {project.categories.map((category) => category.name).join(", ")}
        </p>
      )}
    </Link>
  );
}
