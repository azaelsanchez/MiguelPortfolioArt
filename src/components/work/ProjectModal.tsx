"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/contentful/types";

type Props = {
  project: Project;
  previousSlug: string;
  nextSlug: string;
};

const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * El modal de una obra, montado por la ruta interceptora
 * `app/[locale]/@modal/(.)work/[slug]`.
 *
 * Se divide en dos componentes a propósito: este de fuera monta el fondo
 * una sola vez (no lleva `key`, así que no vuelve a reproducir el fade al
 * cambiar de proyecto) y controla teclado/cierre; `ProjectModalPanel`, de
 * dentro, lleva `key={project.slug}` para que su estado — qué miniatura de
 * la galería está activa — se reinicie solo con cada proyecto, sin
 * sincronizarlo a mano con un efecto.
 *
 * Navega entre proyectos con `router.replace` (no `push`) para que un único
 * "cerrar" —`router.back()`— vuelva siempre a la rejilla de origen, sin
 * importar cuántas flechas se hayan pulsado antes.
 */
export function ProjectModal({ project, previousSlug, nextSlug }: Props) {
  const router = useRouter();

  function close() {
    router.back();
  }

  function goTo(slug: string) {
    router.replace(`/work/${slug}`, { scroll: false });
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") goTo(nextSlug);
      if (event.key === "ArrowLeft") goTo(previousSlug);
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `close`/`goTo` se recrean cada render; solo importan los slugs.
  }, [previousSlug, nextSlug]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-ink/90 fixed inset-0 z-50 overflow-y-auto"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <ProjectModalPanel
        key={project.slug}
        project={project}
        onClose={close}
        onPrevious={() => goTo(previousSlug)}
        onNext={() => goTo(nextSlug)}
      />
    </motion.div>
  );
}

type PanelProps = {
  project: Project;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

function ProjectModalPanel({
  project,
  onClose,
  onPrevious,
  onNext,
}: PanelProps) {
  const t = useTranslations("project");
  const locale = useLocale();
  const [activeImage, setActiveImage] = useState(project.coverImage);

  const gallery =
    project.gallery.length > 0 ? [project.coverImage, ...project.gallery] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE_OUT_SOFT }}
      className="bg-canvas mx-auto my-6 grid min-h-[calc(100%-3rem)] max-w-6xl grid-rows-[auto_1fr] md:my-10 md:min-h-0 md:grid-cols-[1.4fr_1fr] md:grid-rows-1"
    >
      {/* Imagen: a tamaño máximo dentro de su mitad. */}
      <div className="bg-canvas-sunken relative flex min-h-[50svh] items-center justify-center overflow-hidden md:min-h-[70vh]">
        <Image
          key={activeImage.url}
          src={activeImage.url}
          alt={activeImage.alt}
          width={activeImage.width}
          height={activeImage.height}
          sizes="(min-width: 768px) 60vw, 100vw"
          priority
          className="max-h-[50svh] w-auto object-contain md:max-h-[70vh]"
        />

        <button
          type="button"
          onClick={onPrevious}
          aria-label={t("previousProject")}
          className="text-canvas/80 hover:text-canvas absolute top-1/2 left-2 -translate-y-1/2 p-3 text-2xl md:left-4"
        >
          ←
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label={t("nextProject")}
          className="text-canvas/80 hover:text-canvas absolute top-1/2 right-2 -translate-y-1/2 p-3 text-2xl md:right-4"
        >
          →
        </button>
      </div>

      {/* Ficha: metadatos a la derecha. */}
      <div className="flex flex-col overflow-y-auto p-6 md:p-10">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-heading text-balance">
            {project.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-muted hover:text-ink shrink-0 text-sm"
          >
            {t("closeLightbox")}
          </button>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="eyebrow">{t("year")}</dt>
            <dd className="text-ink mt-1">{project.year}</dd>
          </div>
          {project.technique && (
            <div>
              <dt className="eyebrow">{t("technique")}</dt>
              <dd className="text-ink mt-1">{project.technique}</dd>
            </div>
          )}
          {project.dimensions && (
            <div>
              <dt className="eyebrow">{t("dimensions")}</dt>
              <dd className="text-ink mt-1">{project.dimensions}</dd>
            </div>
          )}
          {project.categories.length > 0 && (
            <div>
              <dt className="eyebrow">{t("categories")}</dt>
              <dd className="text-ink mt-1">
                {project.categories.map((category) => category.name).join(", ")}
              </dd>
            </div>
          )}
        </dl>

        {project.description.length > 0 && (
          <div className="text-ink-muted mt-6 space-y-3 text-sm text-pretty">
            {project.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}

        {gallery.length > 1 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {gallery.map((image) => (
              <li key={image.url}>
                <button
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={cn(
                    "bg-canvas-sunken block h-16 w-16 overflow-hidden border-2 transition-colors duration-300 ease-(--ease-out-soft)",
                    activeImage.url === image.url
                      ? "border-ink"
                      : "border-transparent",
                  )}
                >
                  <Image
                    src={image.url}
                    alt=""
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/*
          Un `<a>` normal, no el `<Link>` de next-intl: ese activaría la
          misma ruta interceptora y no llegaríamos nunca a la página
          completa. Una etiqueta corriente fuerza una navegación dura.
        */}
        <a
          href={`/${locale}/work/${project.slug}`}
          className="text-ink decoration-line-strong hover:decoration-ink mt-8 text-sm underline underline-offset-4 transition-colors duration-300 ease-(--ease-out-soft)"
        >
          {t("viewFullPage")} →
        </a>
      </div>
    </motion.div>
  );
}
