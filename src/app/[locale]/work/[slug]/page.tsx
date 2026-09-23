import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { JsonLd } from "@/components/ui/JsonLd";
import { Lightbox } from "@/components/work/Lightbox";
import { toLocale } from "@/lib/i18n/routing";
import { buildAlternates } from "@/lib/seo";
import { getProjectBySlug, getProjectSlugs } from "@/lib/contentful/queries";

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
  const project = await getProjectBySlug(locale, slug);

  if (!project) notFound();

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

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start md:gap-16">
          <div className="bg-canvas-sunken overflow-hidden">
            <Image
              src={project.coverImage.url}
              alt={project.coverImage.alt}
              width={project.coverImage.width}
              height={project.coverImage.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              className="h-auto w-full"
            />
          </div>

          <div>
            <h1 className="font-display text-title text-balance">
              {project.title}
            </h1>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
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

            <div className="mt-8 max-w-prose space-y-4 text-lg text-pretty">
              {project.description.map((paragraph) => (
                <p key={paragraph} className="text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            {project.videoUrl && (
              <div className="mt-8">
                <VideoEmbed url={project.videoUrl} title={project.title} />
              </div>
            )}
          </div>
        </div>

        {project.gallery.length > 0 && (
          <div className="mt-16">
            <h2 className="eyebrow">{t("gallery")}</h2>
            <Lightbox images={[project.coverImage, ...project.gallery]} />
          </div>
        )}
      </Container>
    </>
  );
}
