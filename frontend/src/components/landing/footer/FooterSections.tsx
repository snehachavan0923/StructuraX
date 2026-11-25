import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Blocks, Sparkles } from "lucide-react";
import { Button } from "../../ui/button";
import { fadeIn } from "../../../lib/motion";

export function FinalCtaSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background glow & gradients */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary)]/5 to-[var(--surface-elevated)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-[var(--primary)] opacity-20 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative text-center">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-3xl border border-[var(--border-strong)] bg-gradient-to-b from-[var(--surface)] to-[var(--surface-elevated)] p-8 md:p-14 shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--primary)] mb-5">
            <Sparkles size={14} />
            <span>Ready for Deep Understanding?</span>
          </div>

          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
            Make Every DSA Concept Click.
          </h2>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
            Step through pointer shifts, predict algorithm states, and develop the mental models
            that top software engineers rely on every single day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/curriculum" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                trailingIcon={<ArrowRight size={16} />}
                className="w-full sm:w-auto text-base shadow-lg shadow-[var(--primary)]/20"
              >
                Start Learning
              </Button>
            </Link>

            <Link to="/design-system" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base hover:bg-[var(--surface-elevated)]"
              >
                Explore StructuraX
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
                <Blocks size={18} />
              </span>
              <span className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
                Structura<span className="text-[var(--primary)]">X</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              An AI-powered, animation-first data structures and algorithms learning platform.
            </p>
            <div className="text-xs font-mono text-[var(--text-secondary)]">
              Powered by C Engine Tracing
            </div>
          </div>

          {/* Product Col */}
          <div>
            <h4 className="font-['Space_Grotesk'] text-sm font-semibold text-[var(--text-primary)] mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">
                  Interactive Visualizer
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">
                  Step Prediction
                </a>
              </li>
              <li>
                <Link to="/design-system" className="hover:text-[var(--text-primary)] transition-colors">
                  Design System
                </Link>
              </li>
              <li>
                <Link to="/curriculum" className="hover:text-[var(--text-primary)] transition-colors">
                  Visual Sandbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Col */}
          <div>
            <h4 className="font-['Space_Grotesk'] text-sm font-semibold text-[var(--text-primary)] mb-3">
              Curriculum
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <Link to="/learn/linked-lists" className="hover:text-[var(--text-primary)] transition-colors">
                  Linked Lists
                </Link>
              </li>
              <li>
                <Link to="/learn/stacks" className="hover:text-[var(--text-primary)] transition-colors">
                  Stacks & Queues
                </Link>
              </li>
              <li>
                <Link to="/learn/trees" className="hover:text-[var(--text-primary)] transition-colors">
                  Binary Trees & AVL
                </Link>
              </li>
              <li>
                <Link to="/learn/graphs" className="hover:text-[var(--text-primary)] transition-colors">
                  Graph Algorithms
                </Link>
              </li>
            </ul>
          </div>

          {/* Project & Tech Col */}
          <div>
            <h4 className="font-['Space_Grotesk'] text-sm font-semibold text-[var(--text-primary)] mb-3">
              About
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <span className="text-[var(--text-secondary)]">Phase 3: Production Shell</span>
              </li>
              <li>
                <span className="text-[var(--text-secondary)]">CFFI & Fast Trace Parsing</span>
              </li>
              <li>
                <span className="text-[var(--text-secondary)]">Framer Motion & SVG Core</span>
              </li>
              <li>
                <span className="text-[var(--text-secondary)]">FastAPI Health Monitored</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} StructuraX. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
