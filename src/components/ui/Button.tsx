import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "solid" | "outline" | "ghost";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm tracking-wide transition-colors duration-300 ease-(--ease-out-soft) disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  solid: "bg-ink text-canvas hover:bg-accent",
  outline:
    "border border-line-strong text-ink hover:border-ink hover:bg-canvas-sunken",
  ghost: "text-ink-muted hover:text-ink",
};

/** Clases compartidas para que un `<Link>` se vea como un botón. */
export function buttonClasses(
  variant: ButtonVariant = "solid",
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], className);
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = "solid", className, ...props }: Props) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}
