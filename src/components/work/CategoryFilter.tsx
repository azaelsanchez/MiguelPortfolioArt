"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/cn";
import type { Category } from "@/lib/contentful/types";

type Props = {
  categories: Category[];
};

/** Nombre del parámetro de la URL; lo comparte con `WorkGrid`. */
export const CATEGORY_PARAM = "cat";

export function CategoryFilter({ categories }: Props) {
  const t = useTranslations("work");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get(CATEGORY_PARAM);

  function select(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set(CATEGORY_PARAM, slug);
    } else {
      params.delete(CATEGORY_PARAM);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div
      role="group"
      aria-label={t("title")}
      className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
    >
      <button
        type="button"
        onClick={() => select(null)}
        aria-pressed={!active}
        className={cn(
          "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors duration-300 ease-(--ease-out-soft)",
          !active
            ? "border-accent bg-accent text-canvas"
            : "border-line-strong text-ink-muted hover:border-accent hover:text-accent",
        )}
      >
        {t("allCategories")}
      </button>
      {categories.map((category) => {
        const isActive = active === category.slug;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => select(category.slug)}
            aria-pressed={isActive}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors duration-300 ease-(--ease-out-soft)",
              isActive
                ? "border-accent bg-accent text-canvas"
                : "border-line-strong text-ink-muted hover:border-accent hover:text-accent",
            )}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
