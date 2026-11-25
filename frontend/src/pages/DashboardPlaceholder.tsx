import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { LayoutDashboard, ArrowRight, Clock, Award, Sparkles, BookOpen } from "lucide-react";
import { Button } from "../components/ui/button";

export default function DashboardPlaceholder() {
  return (
    <AppShell breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--surface-elevated)] to-[var(--surface)] p-6 md:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)] mb-3">
              <Sparkles size={13} />
              <span>Student Workspace Foundation</span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
              Learning Dashboard
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              This is the application shell container prepared for the upcoming authenticated student experience.
              Real authentication, live progress sync, and personal challenge histories will land in subsequent phases.
            </p>
          </div>
        </div>

        {/* Status notice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-3 text-[var(--primary)] mb-2">
              <LayoutDashboard size={18} />
              <h3 className="font-['Space_Grotesk'] text-base font-bold">Planned Metrics</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Visual mastery scoring, topic completion indices, and active prediction accuracy rates.
            </p>
            <span className="text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--border)] px-2 py-0.5 rounded bg-[var(--surface-elevated)]">
              Phase 4+ Scope
            </span>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-3 text-[var(--accent)] mb-2">
              <Clock size={18} />
              <h3 className="font-['Space_Grotesk'] text-base font-bold">Recent Sandboxes</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Resume your recent pointer tracing sessions and open debugging challenges.
            </p>
            <span className="text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--border)] px-2 py-0.5 rounded bg-[var(--surface-elevated)]">
              Phase 4+ Scope
            </span>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-3 text-[var(--secondary)] mb-2">
              <Award size={18} />
              <h3 className="font-['Space_Grotesk'] text-base font-bold">Verification Badges</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Verified comprehension badges earned through error diagnosis and quiz completions.
            </p>
            <span className="text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--border)] px-2 py-0.5 rounded bg-[var(--surface-elevated)]">
              Phase 4+ Scope
            </span>
          </div>
        </div>

        {/* Quick Links to available preview areas */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)] mb-4">
            Available Explorations
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/curriculum">
              <Button variant="primary" size="sm" trailingIcon={<ArrowRight size={14} />}>
                Browse Curriculum
              </Button>
            </Link>
            <Link to="/learn/linked-lists">
              <Button variant="secondary" size="sm" leadingIcon={<BookOpen size={14} />}>
                Preview Linked List Sandbox
              </Button>
            </Link>
            <Link to="/design-system">
              <Button variant="outline" size="sm">
                Design System Preview
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
