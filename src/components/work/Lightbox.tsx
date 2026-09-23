"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import type { ImageAsset } from "@/lib/contentful/types";

type Props = {
  images: ImageAsset[];
};

const SWIPE_THRESHOLD = 50;

export function Lightbox({ images }: Props) {
  const t = useTranslations("project");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + direction + images.length) % images.length;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  const active = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.url}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="bg-canvas-sunken block w-full overflow-hidden"
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-500 ease-(--ease-out-soft) hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("gallery")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-ink/95 fixed inset-0 z-50 flex flex-col"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const delta =
                event.changedTouches[0].clientX - touchStartX.current;
              if (delta > SWIPE_THRESHOLD) step(-1);
              else if (delta < -SWIPE_THRESHOLD) step(1);
              touchStartX.current = null;
            }}
          >
            <div className="flex items-center justify-between p-6">
              <p className="text-canvas/70 text-sm">
                {(openIndex ?? 0) + 1} / {images.length}
              </p>
              <button
                type="button"
                onClick={close}
                className="text-canvas hover:text-canvas/70 text-sm"
              >
                {t("closeLightbox")}
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
              <motion.div
                key={active.url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="relative max-h-full max-w-full"
              >
                <Image
                  src={active.url}
                  alt={active.alt}
                  width={active.width}
                  height={active.height}
                  sizes="100vw"
                  className="max-h-[80svh] w-auto object-contain"
                />
              </motion.div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={t("previousImage")}
                    className="text-canvas/80 hover:text-canvas absolute top-1/2 left-2 -translate-y-1/2 p-3 text-2xl md:left-6"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={t("nextImage")}
                    className="text-canvas/80 hover:text-canvas absolute top-1/2 right-2 -translate-y-1/2 p-3 text-2xl md:right-6"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
