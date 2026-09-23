import { getTranslations } from "next-intl/server";
import type { Skill, SkillType } from "@/lib/contentful/types";

type Props = {
  skills: Skill[];
};

const GROUPS: Array<{
  type: SkillType;
  labelKey: "specialties" | "tools" | "languages";
}> = [
  { type: "specialty", labelKey: "specialties" },
  { type: "tool", labelKey: "tools" },
  { type: "language", labelKey: "languages" },
];

export async function Skills({ skills }: Props) {
  const t = await getTranslations("about");

  return (
    <div className="grid gap-10 sm:grid-cols-3">
      {GROUPS.map(({ type, labelKey }) => {
        const items = skills.filter((skill) => skill.type === type);
        if (items.length === 0) return null;

        return (
          <div key={type}>
            <p className="eyebrow">{t(labelKey)}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {items.map((skill) => (
                <li
                  key={skill.id}
                  className="border-line-strong text-ink-muted rounded-full border px-3 py-1.5 text-sm"
                >
                  {skill.name}
                  {skill.level && (
                    <span className="text-ink-subtle"> · {skill.level}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
