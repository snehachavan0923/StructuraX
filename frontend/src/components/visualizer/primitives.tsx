import { ArrowRight, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { ReactNode, SVGProps } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/feedback";

export function VisualizerWorkspace({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="visualizer-workspace" aria-label={title}>
      <div className="visualizer-workspace__toolbar">
        <span className="eyebrow">{title}</span>
        <Badge tone="information">Preview primitive</Badge>
      </div>
      {children}
    </section>
  );
}

export function VisualizerNode({
  value,
  label,
  selected = false,
}: {
  value: ReactNode;
  label?: string;
  selected?: boolean;
}) {
  return (
    <div className={cn("visualizer-node", selected && "visualizer-node--active")}>
      {label && <span className="visualizer-node__label">{label}</span>}
      <span className="visualizer-node__value">{value}</span>
    </div>
  );
}

export function PointerLabel({ children }: { children: ReactNode }) {
  return <span className="pointer-label">{children}</span>;
}

export function IndexLabel({ children }: { children: ReactNode }) {
  return <span className="index-label">{children}</span>;
}

export function ConnectionArrow({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn("connection-arrow", className)}
      viewBox="0 0 64 16"
      fill="none"
      role="img"
      aria-label="Connection to next node"
      {...props}
    >
      <path d="M2 8h56m0 0-6-6m6 6-6 6" />
    </svg>
  );
}

export function ExecutionStep({
  current,
  total,
  description,
}: {
  current: number;
  total: number;
  description: string;
}) {
  return (
    <div className="execution-step" aria-live="polite">
      <span className="execution-step__count mono">
        {String(current).padStart(2, "0")}
        <span> / {String(total).padStart(2, "0")}</span>
      </span>
      <span>{description}</span>
    </div>
  );
}

export function PlaybackControls() {
  return (
    <div className="playback-controls" aria-label="Playback controls">
      <Button variant="ghost" size="icon" aria-label="Restart" type="button">
        <RotateCcw size={16} />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Previous step" type="button">
        <SkipBack size={16} />
      </Button>
      <Button
        variant="primary"
        size="icon"
        aria-label="Play"
        type="button"
      >
        <Play size={16} />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Next step" type="button">
        <SkipForward size={16} />
      </Button>
      <span className="playback-controls__speed mono">1×</span>
    </div>
  );
}

export function ExecutionProgress({ value }: { value: number }) {
  return (
    <div className="execution-progress">
      <div
        className="execution-progress__track"
        role="progressbar"
        aria-label="Execution progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(100, Math.max(0, value))}
      >
        <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
      <span className="execution-progress__arrow" aria-hidden="true">
        <ArrowRight size={14} />
      </span>
    </div>
  );
}

export function StatusIndicator({
  status,
  label,
}: {
  status: "idle" | "running" | "complete" | "error";
  label: string;
}) {
  return (
    <span className={cn("status-indicator", `status-indicator--${status}`)}>
      <span aria-hidden="true" />
      {label}
    </span>
  );
}
