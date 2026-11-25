import { AlertCircle, Check, Info, X, type LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type BadgeTone = "neutral" | "success" | "warning" | "error" | "information";

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span className={cn("badge", `badge--${tone}`, className)} {...props} />
  );
}

export function Tooltip({
  content,
  children,
}: {
  content: string;
  children: ReactNode;
}) {
  const id = `tooltip-${content.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <span className="tooltip" tabIndex={0} aria-describedby={id}>
      <span className="tooltip__trigger">{children}</span>
      <span className="tooltip__content" id={id} role="tooltip">
        {content}
      </span>
    </span>
  );
}

export function Toast({
  tone = "information",
  title,
  children,
  onDismiss,
}: {
  tone?: "success" | "error" | "information";
  title: string;
  children: ReactNode;
  onDismiss?: () => void;
}) {
  const icons: Record<typeof tone, LucideIcon> = {
    success: Check,
    error: AlertCircle,
    information: Info,
  };
  const Icon = icons[tone];

  return (
    <div className={cn("toast", `toast--${tone}`)} role="status">
      <Icon aria-hidden="true" size={18} />
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
      {onDismiss && (
        <button
          className="icon-button toast__close"
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function Progress({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const boundedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="progress">
      <div className="progress__labels">
        <span>{label}</span>
        <span className="mono">{boundedValue}%</span>
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={boundedValue}
      >
        <span style={{ width: `${boundedValue}%` }} />
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("skeleton", className)} />;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="state-panel">
      <span className="state-panel__icon" aria-hidden="true">
        <Info size={20} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="state-panel state-panel--error" role="alert">
      <span className="state-panel__icon" aria-hidden="true">
        <AlertCircle size={20} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
