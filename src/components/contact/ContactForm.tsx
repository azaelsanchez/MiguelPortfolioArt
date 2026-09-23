"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { buttonClasses } from "@/components/ui/Button";
import { Turnstile } from "./Turnstile";
import {
  type ContactStatus,
  initialContactState,
  sendContactMessage,
} from "@/lib/actions/contact";

const FIELD_CLASSES =
  "border-line-strong bg-transparent py-2 text-ink outline-none transition-colors duration-300 ease-(--ease-out-soft) focus:border-ink border-b";

function useErrorMessage(status: ContactStatus): string | null {
  const t = useTranslations("contact");

  switch (status) {
    case "invalid":
      return t("errorInvalid");
    case "rate_limited":
      return t("errorRateLimited");
    case "captcha":
      return t("errorCaptcha");
    case "not_configured":
    case "send_failed":
      return t("error");
    default:
      return null;
  }
}

function SubmitButton() {
  const t = useTranslations("contact");
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonClasses("solid", "self-start")}
    >
      {pending ? t("sending") : t("send")}
    </button>
  );
}

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, formAction] = useActionState(
    sendContactMessage,
    initialContactState,
  );
  const [turnstileToken, setTurnstileToken] = useState("");
  const errorMessage = useErrorMessage(state.status);

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="turnstileToken" value={turnstileToken} />

      {/* Honeypot: invisible para una persona, presente en el DOM para un bot. */}
      <p className="absolute -left-[9999px]" aria-hidden>
        <label>
          Empresa
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className="text-ink text-sm">
          {t("name")}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          className={FIELD_CLASSES}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="text-ink text-sm">
          {t("email")}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          className={FIELD_CLASSES}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-ink text-sm">
          {t("message")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          className={`${FIELD_CLASSES} resize-none`}
        />
      </div>

      <Turnstile onVerify={setTurnstileToken} />

      <div aria-live="polite" className="min-h-6 text-sm">
        {state.status === "success" && (
          <p className="text-success">{t("success")}</p>
        )}
        {errorMessage && <p className="text-error">{errorMessage}</p>}
      </div>

      <SubmitButton />
    </form>
  );
}
