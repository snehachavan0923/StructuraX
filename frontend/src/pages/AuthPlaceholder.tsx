import { Link, useLocation } from "react-router-dom";
import { Blocks, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "../components/ui/button";

export default function AuthPlaceholder() {
  const location = useLocation();
  const isSignUp = location.pathname.includes("signup");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4 text-[var(--text-primary)]">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl text-center">
        {/* Brand */}
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-md">
            <Blocks size={24} />
          </div>
        </div>

        <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
          Authentication Gateway
        </span>
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--text-primary)] mb-3">
          {isSignUp ? "Create StructuraX Account" : "Sign In to StructuraX"}
        </h1>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-400 mb-6 text-left flex items-start gap-3">
          <ShieldAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">Phase 3 Scope Notice</span>
            <span>
              Real user authentication, sessions, and database auth tables will be implemented in future development phases.
              This placeholder prevents broken links while maintaining strict technical honesty.
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Link to="/dashboard">
            <Button variant="primary" className="w-full justify-center">
              Continue to Student Shell (Preview)
            </Button>
          </Link>

          <Link to="/">
            <Button variant="outline" className="w-full justify-center" leadingIcon={<ArrowLeft size={14} />}>
              Back to Landing Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
