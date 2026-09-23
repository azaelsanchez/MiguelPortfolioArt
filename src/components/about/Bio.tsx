"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { buttonClasses } from "@/components/ui/Button";
import type { ImageAsset } from "@/lib/contentful/types";

type Props = {
  portrait: ImageAsset;
  bioShort: string;
  bioLong: string[];
  cvFileUrl: string;
};

export function Bio({ portrait, bioShort, bioLong, cvFileUrl }: Props) {
  const t = useTranslations("about");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16">
      <div className="bg-canvas-sunken overflow-hidden">
        <Image
          src={portrait.url}
          alt={portrait.alt}
          width={portrait.width}
          height={portrait.height}
          sizes="(min-width: 768px) 20rem, 60vw"
          priority
          className="h-auto w-full"
        />
      </div>

      <div>
        <p className="text-ink-muted text-lg text-pretty">{bioShort}</p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="text-ink-muted mt-4 space-y-4 text-lg text-pretty">
                {bioLong.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="text-ink decoration-line-strong hover:decoration-ink text-sm underline underline-offset-4 transition-colors duration-300 ease-(--ease-out-soft)"
          >
            {expanded ? t("readLess") : t("readMore")}
          </button>

          <a
            href={cvFileUrl}
            download
            className={buttonClasses("outline", "ml-auto")}
          >
            {t("downloadCv")}
          </a>
        </div>
      </div>
    </div>
  );
}
