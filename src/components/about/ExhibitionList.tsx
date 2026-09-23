"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import type { Exhibition, ExhibitionType } from "@/lib/contentful/types";

type Props = {
  exhibitions: Exhibition[];
};

type Filter = "all" | ExhibitionType;

export function ExhibitionList({ exhibitions }: Props) {
  const t = useTranslations("about");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all"
      ? exhibitions
      : exhibitions.filter((exhibition) => exhibition.type === filter);

  const byYear = useMemo(() => {
    const groups = new Map<number, Exhibition[]>();
    for (const exhibition of filtered) {
      const group = groups.get(exhibition.year) ?? [];
      group.push(exhibition);
      groups.set(exhibition.year, group);
    }
    return [...groups.entries()].sort(([a], [b]) => b - a);
  }, [filtered]);

  const filters: Array<{ value: Filter; label: string }> = [
    { value: "all", label: t("allExhibitions") },
    { value: "solo", label: t("solo") },
    { value: "group", label: t("group") },
  ];

  return (
    <div>
      <div role="group" aria-label={t("exhibitions")} className="flex gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            aria-pressed={filter === item.value}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors duration-300 ease-(--ease-out-soft)",
              filter === item.value
                ? "border-ink bg-ink text-canvas"
                : "border-line-strong text-ink-muted hover:border-ink hover:text-ink",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-8">
        {byYear.map(([year, items]) => (
          <div key={year} className="grid gap-2 sm:grid-cols-[5rem_1fr]">
            <p className="font-display text-ink-subtle text-lg">{year}</p>
            <ul className="space-y-3">
              {items.map((exhibition) => (
                <li key={exhibition.id}>
                  <p className="text-ink">
                    {exhibition.title}
                    {exhibition.group && (
                      <span className="text-ink-muted">
                        {" "}
                        · {exhibition.group}
                      </span>
                    )}
                  </p>
                  <p className="text-ink-muted text-sm">
                    {exhibition.venue}, {exhibition.city}
                    {exhibition.country !== "España" &&
                      `, ${exhibition.country}`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
