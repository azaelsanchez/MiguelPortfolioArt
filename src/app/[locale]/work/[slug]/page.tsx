import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { JsonLd } from "@/components/ui/JsonLd";
import { Lightbox } from "@/components/work/Lightbox";
import { ProjectNav } from "@/components/work/ProjectNav";
import { toLocale } from "@/lib/i18n/routing";
import { buildAlternates } from "@/lib/seo";
import {
  getProjectBySlug,
  getProjects,
  getProjectSlugs,
} from "@/lib/contentful/queries";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/work/[slug]">,
): Promise<Metadata> {
  const { locale: rawLocale, slug } = await props.params;
  const locale = toLocale(rawLocale);
  const project = await getProjectBySlug(locale, slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description[0],
    alternates: buildAlternates(locale, `/work/${slug}`),
    openGraph: {
      title: project.title,
      description: project.description[0],
      images: [
        {
          url: project.coverImage.url,
          width: project.coverImage.width,
          height: project.coverImage.height,
          alt: project.coverImage.alt,
        },
      ],
    },
  };
}

export default async function ProjectPage(
  props: PageProps<"/[locale]/work/[slug]">,
) {
  const { slug } = await props.params;
  const locale = await getLocale();
  const t = await getTranslations("project");

  const [project, allProjects] = await Promise.all([
    getProjectBySlug(locale, slug),
    getProjects(locale),
  ]);

  if (!project) notFound();

  const index = allProjects.findIndex((item) => item.slug === project.slug);
  const previous = allProjects.at(index - 1) ?? allProjects.at(-1);
  const next = allProjects.at((index + 1) % allProjects.length);
  const galleryImages =
    project.gallery.length > 0 ? project.gallery : [project.coverImage];

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description[0],
    image: project.coverImage.url || undefined,
    dateCreated: String(project.year),
    creator: {
      "@type": "Person",
      name: "Miguel Ángel Gómez Balbuena",
    },
    ...(project.technique ? { artMedium: project.technique } : {}),
  };

  return (
    <>
      <JsonLd data={creativeWorkJsonLd} />
      <Container as="article" width="wide" className="py-section">
        <Link
          href="/work"
          className="eyebrow hover:text-ink inline-block transition-colors duration-300 ease-(--ease-out-soft)"
        >
          ← {t("backToWork")}
        </Link>

        <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr] md:items-start md:gap-16">
          <h1 className="font-display text-title text-balance">
            {project.title}
          </h1>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm md:grid-cols-1">
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
                  {project.categories
                    .map((category) => category.name)
                    .join(", ")}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-10 max-w-2xl space-y-4 text-lg text-pretty">
          {project.description.map((paragraph) => (
            <p key={paragraph} className="text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>

        {project.videoUrl && (
          <div className="mt-12">
            <VideoEmbed url={project.videoUrl} title={project.title} />
          </div>
        )}

        <Lightbox images={galleryImages} />
      </Container>

      {previous && next && <ProjectNav previous={previous} next={next} />}
    </>
  );
}
