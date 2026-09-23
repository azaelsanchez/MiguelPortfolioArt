"use client";

import { useEffect, useId } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: { sitekey: string; callback: (token: string) => void },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

type Props = {
  onVerify: (token: string) => void;
};

/**
 * Widget de Cloudflare Turnstile.
 *
 * Sin `NEXT_PUBLIC_TURNSTILE_SITE_KEY` no renderiza nada: el formulario
 * sigue siendo usable (la Server Action deja pasar si tampoco hay
 * `TURNSTILE_SECRET_KEY`), pero sin verificación real hasta que exista un
 * sitio dado de alta en Turnstile.
 */
export function Turnstile({ onVerify }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const elementId = `turnstile-${useId().replace(/[:]/g, "")}`;

  useEffect(() => {
    if (!siteKey) return;

    let widgetId: string | undefined;
    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | undefined;

    function render() {
      if (cancelled || !window.turnstile) return;
      widgetId = window.turnstile.render(`#${elementId}`, {
        sitekey: siteKey!,
        callback: onVerify,
      });
    }

    if (window.turnstile) {
      render();
    } else {
      poll = setInterval(() => {
        if (window.turnstile) {
          if (poll) clearInterval(poll);
          render();
        }
      }, 200);
    }

    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
      if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
    };
  }, [siteKey, elementId, onVerify]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div id={elementId} />
    </>
  );
}
