import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
// TODO(azael): probando CORNER_WASH frente a SITE_WASH — decidir y quitar el que no se use.
import { CORNER_WASH, PaintWash } from "@/components/ui/PaintWash";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { JsonLd } from "@/components/ui/JsonLd";
import { isLocale, locales } from "@/lib/i18n/routing";
import { getSiteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/lib/contentful/queries";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: t("siteName"),
      template: `%s · ${t("siteName")}`,
    },
    description: t("defaultDescription"),
  };
}

export default async function LocaleLayout({
  children,
  modal,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "nav" });
  const settings = await getSiteSettings(locale);
  const siteUrl = getSiteUrl();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Miguel Ángel Gómez Balbuena",
    url: siteUrl,
    image: settings.portrait.url || undefined,
    jobTitle: settings.tagline,
    description: settings.bioShort,
    email: settings.email,
    sameAs: Object.values(settings.socialLinks).filter(Boolean),
  };

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      {/*
        `suppressHydrationWarning` en `body`: algunas extensiones del
        navegador (ColorZilla, Grammarly…) inyectan atributos como
        `cz-shortcut-listen` en cuanto carga la página, antes de que React
        hidrate. React los ve como un "mismatch" servidor/cliente y avisa en
        consola, pero no es un bug nuestro ni afecta a nada — solo silencia
        ese aviso concreto para `body`, no baja al resto del árbol.
      */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <JsonLd data={personJsonLd} />
        <NextIntlClientProvider>
          <MotionProvider>
            <SmoothScroll />
            <PaintWash stains={CORNER_WASH} />
            <GrainOverlay />
            <a
              href="#main"
              className="focus:bg-ink focus:text-canvas sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:px-5 focus:py-2 focus:text-sm"
            >
              {t("skipToContent")}
            </a>
            <Header socialLinks={settings.socialLinks} />
            <main id="main" className="flex-1 pt-16 md:pt-20">
              {children}
            </main>
            <Footer />
            {modal}
          </MotionProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
