import { useParams, Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { HeroVisualizer } from "../components/landing/hero/HeroVisualizer";
import { ArrowLeft, BookOpen, Terminal } from "lucide-react";

export default function LearningPlaceholder() {
  const { topicId } = useParams<{ topicId: string }>();
  const formattedTitle = (topicId || "Data Structure")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <AppShell
      breadcrumbs={[
        { label: "Curriculum", href: "/curriculum" },
        { label: formattedTitle },
      ]}
    >
      <div className="space-y-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/curriculum" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1">
                <ArrowLeft size={13} /> Back to Curriculum
              </Link>
            </div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              {formattedTitle} Module
            </h1>
            <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
              Topic Identifier: <span className="text-[var(--primary)]">{topicId}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]">
              Preview Mode
            </span>
          </div>
        </div>

        {/* Visualizer Sandbox Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
              <Terminal size={14} className="text-[var(--accent)]" /> Interactive Workspace Canvas
            </span>
            <span>Trace Preview</span>
          </div>

          <HeroVisualizer />
        </div>

        {/* Informational Card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 mt-6">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] mb-2">
            <BookOpen size={16} className="text-[var(--primary)]" />
            <span>Upcoming Learning Experience</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            In Phase 4 and subsequent milestones, this workspace will connect directly to the compiled C engine
            execution bridge, enabling step-by-step native pointer state transitions, interactive operation sandboxes,
            and automated test harnesses.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
