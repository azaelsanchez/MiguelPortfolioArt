"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { CATEGORY_PARAM } from "./CategoryFilter";
import { WorkCard } from "./WorkCard";
import { buttonClasses } from "@/components/ui/Button";
import type { Project } from "@/lib/contentful/types";

type Props = {
  projects: Project[];
  /** Cuántas tarjetas mostrar antes de necesitar "Mostrar más". Sin esto, se ven todas. */
  initialCount?: number;
};

export function WorkGrid({ projects, initialCount }: Props) {
  const t = useTranslations("work");
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get(CATEGORY_PARAM);

  const filtered = activeCategory
    ? projects.filter((project) =>
        project.categories.some((category) => category.slug === activeCategory),
      )
    : projects;

  if (filtered.length === 0) {
    return <p className="text-ink-muted mt-24 text-center">{t("empty")}</p>;
  }

  return (
    // `key` fuerza a remontar al cambiar de categoría: es lo que reinicia
    // `visibleCount` a `initialCount` sin tener que sincronizarlo a mano
    // con un efecto.
    <WorkGridPage
      key={activeCategory ?? "all"}
      projects={filtered}
      initialCount={initialCount}
    />
  );
}

function WorkGridPage({ projects, initialCount }: Props) {
  const t = useTranslations("work");
  const step = initialCount ?? projects.length;
  const [visibleCount, setVisibleCount] = useState(step);
  const visible = projects.slice(0, visibleCount);

  return (
    <>
      <div className="mt-12 columns-1 gap-8 sm:columns-2 lg:columns-3">
        <AnimatePresence initial={false}>
          {visible.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <WorkCard project={project} priority={index < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visibleCount < projects.length && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + step)}
            className={buttonClasses("solid")}
          >
            {t("showMore")}
          </button>
        </div>
      )}
    </>
  );
}
