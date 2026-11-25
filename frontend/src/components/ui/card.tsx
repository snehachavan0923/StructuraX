import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type CardVariant = "standard" | "elevated" | "interactive" | "information";

type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: CardVariant;
  as?: "article" | "section" | "div";
};

export function Card({
  variant = "standard",
  as: Component = "article",
  className,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn("card", `card--${variant}`, className)}
      {...props}
    />
  );
}

type CardPartProps = HTMLAttributes<HTMLElement> & { children?: ReactNode };

export function CardHeader({ className, ...props }: CardPartProps) {
  return <header className={cn("card__header", className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardPartProps) {
  return <h3 className={cn("card__title", className)} {...props} />;
}

export function CardDescription({ className, ...props }: CardPartProps) {
  return <p className={cn("card__description", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardPartProps) {
  return <div className={cn("card__content", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardPartProps) {
  return <footer className={cn("card__footer", className)} {...props} />;
}
