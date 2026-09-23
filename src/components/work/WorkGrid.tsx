"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { CATEGORY_PARAM } from "./CategoryFilter";
import { WorkCard } from "./WorkCard";
import type { Project } from "@/lib/contentful/types";

type Props = {
  projects: Project[];
};

export function WorkGrid({ projects }: Props) {
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
    <div className="mt-12 columns-1 gap-8 sm:columns-2 lg:columns-3">
      <AnimatePresence initial={false}>
        {filtered.map((project, index) => (
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
  );
}
