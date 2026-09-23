import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { PaintWash, WASH_PRESETS } from "@/components/ui/PaintWash";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <Container
      as="section"
      width="narrow"
      className="py-section relative flex min-h-[60svh] flex-col justify-center text-center"
    >
      <PaintWash blobs={WASH_PRESETS.whisper} />
      <p className="eyebrow">404</p>
      <h1 className="font-display text-title mt-4">{t("title")}</h1>
      <p className="text-ink-muted mt-4 text-pretty">{t("description")}</p>
      <div className="mt-10 flex justify-center">
        <Link href="/" className={buttonClasses("outline")}>
          {t("backHome")}
        </Link>
      </div>
    </Container>
  );
}
