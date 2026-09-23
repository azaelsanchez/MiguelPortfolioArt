import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import type { Project } from "@/lib/contentful/types";

type Props = {
  project: Project;
  /** Ancho de renderizado aproximado, para pedirle a `next/image` el tamaño correcto. */
  sizes?: string;
  priority?: boolean;
};

export function WorkCard({
  project,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: Props) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group mb-8 block break-inside-avoid"
    >
      <div className="bg-canvas-sunken overflow-hidden">
        <Image
          src={project.coverImage.url}
          alt={project.coverImage.alt}
          width={project.coverImage.width}
          height={project.coverImage.height}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.02]"
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
