import { motion } from "framer-motion";
import { Sparkles, ArrowRight, PlayCircle, Eye, GitFork, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { HeroVisualizer } from "./HeroVisualizer";
import { fadeIn, staggerChildren } from "../../../lib/motion";
import { usePrefersReducedMotion } from "../../../hooks/use-reduced-motion";

export function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      {/* Background radial gradients for depth */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] bg-gradient-to-b from-[var(--primary)]/15 via-[var(--secondary)]/10 to-transparent blur-3xl opacity-70"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          {/* Eyebrow badge */}
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--primary)] backdrop-blur-sm">
              <Sparkles size={13} className="text-[var(--accent)]" />
              <span>Next-Gen Animation-First DSA Platform</span>
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeIn}
            className="font-['Space_Grotesk'] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1] mb-6"
          >
            Understand DSA. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] bg-clip-text text-transparent">
              Don't Just Memorize It.
            </span>
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            variants={fadeIn}
            className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            Explore data structures and algorithms through interactive visualizations, step-by-step
            animations, intelligent challenges and AI-powered guidance.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/curriculum" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                trailingIcon={<ArrowRight size={16} />}
                className="w-full sm:w-auto text-base shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl transition-all"
              >
                Start Learning
              </Button>
            </Link>

            <a href="#curriculum" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                leadingIcon={<PlayCircle size={18} className="text-[var(--primary)]" />}
                className="w-full sm:w-auto text-base hover:bg-[var(--surface-elevated)]"
              >
                Explore Visualizations
              </Button>
            </a>
          </motion.div>

          {/* Quick Technical Highlights */}
          <motion.div
            variants={fadeIn}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--text-secondary)] font-mono"
          >
            <span className="flex items-center gap-1.5">
              <Cpu size={14} className="text-[var(--accent)]" /> Native C Engine Core
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} className="text-[var(--primary)]" /> Pointer-Precision Tracing
            </span>
            <span className="flex items-center gap-1.5">
              <GitFork size={14} className="text-[var(--secondary)]" /> Interactive Step Prediction
            </span>
          </motion.div>
        </motion.div>

        {/* Animated Visual Demonstration */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-5xl"
        >
          <HeroVisualizer />
        </motion.div>
      </div>
    </section>
  );
}
