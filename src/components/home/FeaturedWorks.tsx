import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { WorkCard } from "@/components/work/WorkCard";
import type { Project } from "@/lib/contentful/types";

type Props = {
  projects: Project[];
};

/** Tope de retardo en el reveal escalonado: pasado esto no merece la pena esperar más. */
const MAX_STAGGER_DELAY = 0.4;

export async function FeaturedWorks({ projects }: Props) {
  const t = await getTranslations("home");

  return (
    <section className="py-section">
      <Reveal>
        <p className="eyebrow">{t("featuredTitle")}</p>
        <p className="font-display text-heading mt-2">
          {t("featuredSubtitle")}
        </p>
      </Reveal>

      <div className="mt-12 columns-1 gap-8 sm:columns-2 lg:columns-3">
        {projects.map((project, index) => (
          <Reveal
            key={project.id}
            delay={Math.min(index * 0.08, MAX_STAGGER_DELAY)}
          >
            <WorkCard project={project} priority={index < 3} />
          </Reveal>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <Link href="/work" className={buttonClasses("solid")}>
          {t("ctaWork")}
        </Link>
      </div>
    </section>
  );
}
