import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  as?: ElementType;
  /** `wide` para rejillas de obra, `narrow` para texto largo. */
  width?: "default" | "wide" | "narrow";
  className?: string;
};

const WIDTHS = {
  default: "max-w-7xl",
  wide: "max-w-[110rem]",
  narrow: "max-w-2xl",
} as const;

export function Container({
  children,
  as: Component = "div",
  width = "default",
  className,
}: Props) {
  return (
    <Component
      className={cn("mx-auto w-full px-6 md:px-10", WIDTHS[width], className)}
    >
      {children}
    </Component>
  );
}
