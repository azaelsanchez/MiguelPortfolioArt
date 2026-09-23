import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

type ProjectLink = { slug: string; title: string };

type Props = {
  previous: ProjectLink;
  next: ProjectLink;
};

export async function ProjectNav({ previous, next }: Props) {
  const t = await getTranslations("project");

  return (
    <nav
      aria-label={`${t("previous")} / ${t("next")}`}
      className="border-line mt-section grid grid-cols-2 border-t"
    >
      <Link
        href={`/work/${previous.slug}`}
        className="group border-line hover:bg-canvas-sunken border-r px-6 py-8 transition-colors duration-300 ease-(--ease-out-soft) md:px-10"
      >
        <p className="eyebrow">← {t("previous")}</p>
        <p className="font-display group-hover:text-accent mt-2 text-lg transition-colors duration-300 ease-(--ease-out-soft)">
          {previous.title}
        </p>
      </Link>
      <Link
        href={`/work/${next.slug}`}
        className="group hover:bg-canvas-sunken px-6 py-8 text-right transition-colors duration-300 ease-(--ease-out-soft) md:px-10"
      >
        <p className="eyebrow">{t("next")} →</p>
        <p className="font-display group-hover:text-accent mt-2 text-lg transition-colors duration-300 ease-(--ease-out-soft)">
          {next.title}
        </p>
      </Link>
    </nav>
  );
}
