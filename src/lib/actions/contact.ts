"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { isLocale } from "@/lib/i18n/routing";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(4000),
  // Honeypot: campo oculto por CSS que un humano nunca rellena. Si llega con
  // contenido, es un bot rellenando el formulario a ciegas.
  company: z.string().max(0).optional().or(z.literal("")),
  turnstileToken: z.string().optional(),
  locale: z.string(),
});

export type ContactStatus =
  | "idle"
  | "success"
  | "invalid"
  | "rate_limited"
  | "captcha"
  | "not_configured"
  | "send_failed";

export type ContactState = {
  status: ContactStatus;
};

export const initialContactState: ContactState = { status: "idle" };

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

/**
 * Contador en memoria del proceso.
 *
 * TODO(azael): suficiente para un único servidor (o para Vercel mientras la
 * instancia se mantenga caliente), pero no se comparte entre instancias. Si
 * el tráfico lo justifica, migrar a un store compartido (p. ej. Upstash).
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // TODO(azael): sin `TURNSTILE_SECRET_KEY` no hay forma de verificar el
  // captcha. Se deja pasar para no bloquear el desarrollo, pero antes de
  // publicar hace falta dar de alta el sitio en Cloudflare Turnstile.
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token }),
      },
    );
    const data = (await response.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

async function getClientIp(): Promise<string> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function sendContactMessage(
  _previousState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const rawLocale = formData.get("locale");

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company") ?? "",
    turnstileToken: formData.get("turnstileToken") ?? undefined,
    locale: rawLocale,
  });

  if (!parsed.success) {
    return { status: "invalid" };
  }

  const { name, email, message, company, turnstileToken } = parsed.data;

  if (company) {
    // No delatamos el honeypot: para quien (o lo que) lo rellenó, parece
    // que el envío ha ido bien.
    return { status: "success" };
  }

  const ip = await getClientIp();
  if (isRateLimited(ip)) {
    return { status: "rate_limited" };
  }

  const captchaOk = await verifyTurnstile(turnstileToken);
  if (!captchaOk) {
    return { status: "captcha" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  // TODO(azael): sin `RESEND_API_KEY` / `CONTACT_TO_EMAIL` el formulario
  // valida correctamente pero no envía nada. Hace falta una cuenta en Resend
  // y un dominio verificado para el remitente.
  if (!apiKey || !to) {
    console.warn(
      "[contact] RESEND_API_KEY o CONTACT_TO_EMAIL no configurados; mensaje no enviado.",
      { name, email, messageLength: message.length },
    );
    return { status: "not_configured" };
  }

  try {
    const resend = new Resend(apiKey);
    const localeCandidate =
      typeof rawLocale === "string" ? rawLocale : undefined;
    const locale = isLocale(localeCandidate) ? localeCandidate : "es";
    const subject =
      locale === "en" ? `New message from ${name}` : `Nuevo mensaje de ${name}`;

    const { error } = await resend.emails.send({
      // TODO(azael): sustituir por un remitente del dominio verificado en Resend.
      from: "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject,
      text: `${message}\n\n— ${name} <${email}>`,
    });

    if (error) {
      console.error("[contact] Resend devolvió un error", error);
      return { status: "send_failed" };
    }

    return { status: "success" };
  } catch (error) {
    console.error("[contact] Error enviando con Resend", error);
    return { status: "send_failed" };
  }
}
