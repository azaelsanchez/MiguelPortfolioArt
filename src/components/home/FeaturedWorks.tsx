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

/** Todas las tarjetas del mismo tamaño aquí, a diferencia de la masonry de `/work`. */
const CARD_ASPECT = "aspect-[4/5]";

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

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal
            key={project.id}
            delay={Math.min(index * 0.08, MAX_STAGGER_DELAY)}
          >
            <WorkCard
              project={project}
              priority={index < 3}
              aspect={CARD_ASPECT}
              sizes="(min-width: 768px) 33vw, 50vw"
            />
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
