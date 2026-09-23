import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PaintWash, WASH_PRESETS } from "@/components/ui/PaintWash";
import { Reveal } from "@/components/ui/Reveal";
import { Bio } from "@/components/about/Bio";
import { Timeline, type TimelineItem } from "@/components/about/Timeline";
import { ExhibitionList } from "@/components/about/ExhibitionList";
import { Skills } from "@/components/about/Skills";
import { toLocale } from "@/lib/i18n/routing";
import { buildAlternates } from "@/lib/seo";
import {
  getEducation,
  getExhibitions,
  getExperience,
  getSiteSettings,
  getSkills,
} from "@/lib/contentful/queries";

export async function generateMetadata(
  props: PageProps<"/[locale]/about">,
): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    alternates: buildAlternates(locale, "/about"),
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const [settings, experience, education, exhibitions, skills] =
    await Promise.all([
      getSiteSettings(locale),
      getExperience(locale),
      getEducation(locale),
      getExhibitions(locale),
      getSkills(locale),
    ]);

  const experienceItems: TimelineItem[] = experience.map((item) => ({
    id: item.id,
    years: `${item.yearStart} — ${item.yearEnd ?? t("present")}`,
    title: item.role,
    subtitle: item.organization,
    highlights: item.highlights,
  }));

  const educationItems: TimelineItem[] = education.map((item) => ({
    id: item.id,
    years: `${item.yearStart} — ${item.yearEnd}`,
    title: item.title,
    subtitle: item.institution,
  }));

  return (
    <>
      <Container as="section" width="wide" className="py-section relative">
        <PaintWash blobs={WASH_PRESETS.whisper} />

        <Reveal>
          <h1 className="font-display text-title">{t("title")}</h1>
        </Reveal>

        <div className="mt-12">
          <Bio
            portrait={settings.portrait}
            bioShort={settings.bioShort}
            bioLong={settings.bioLong}
            cvFileUrl={settings.cvFileUrl}
          />
        </div>
      </Container>

      <Container as="section" width="wide" className="py-section">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-heading">{t("experience")}</h2>
            <Timeline items={experienceItems} />
          </div>
          <div>
            <h2 className="font-display text-heading">{t("education")}</h2>
            <Timeline items={educationItems} />
          </div>
        </div>
      </Container>

      <Container as="section" width="wide" className="py-section">
        <h2 className="font-display text-heading">{t("exhibitions")}</h2>
        <div className="mt-8">
          <ExhibitionList exhibitions={exhibitions} />
        </div>
      </Container>

      <Container as="section" width="wide" className="py-section">
        <h2 className="font-display text-heading">{t("skills")}</h2>
        <div className="mt-8">
          <Skills skills={skills} />
        </div>
      </Container>
    </>
  );
}
