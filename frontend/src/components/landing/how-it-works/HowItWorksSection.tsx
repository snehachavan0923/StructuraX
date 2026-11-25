import { motion } from "framer-motion";
import { BookOpen, Film, MousePointerClick, HelpCircle, Bug, Award, ArrowRight } from "lucide-react";
import { fadeIn, staggerChildren } from "../../../lib/motion";

const STEPS = [
  {
    number: "01",
    title: "Learn the Concept",
    desc: "Start with crystal-clear theoretical intuition, memory layout diagrams, and mathematical complexity boundaries.",
    icon: <BookOpen className="text-[var(--primary)]" size={22} />,
  },
  {
    number: "02",
    title: "Watch the Animation",
    desc: "Observe the algorithm execute step-by-step with synchronized high-precision memory pointer animations.",
    icon: <Film className="text-[var(--accent)]" size={22} />,
  },
  {
    number: "03",
    title: "Perform Operations Yourself",
    desc: "Insert, delete, rebalance, and traverse by dragging nodes and invoking operations in your sandbox.",
    icon: <MousePointerClick className="text-[var(--secondary)]" size={22} />,
  },
  {
    number: "04",
    title: "Predict the Next Step",
    desc: "Pause execution at critical branches and test your mental model by predicting the next pointer assignment.",
    icon: <HelpCircle className="text-indigo-400" size={22} />,
  },
  {
    number: "05",
    title: "Solve Debugging Challenges",
    desc: "Encounter deliberately bugged structures and repair memory leaks, cycle loops, and null dereferences.",
    icon: <Bug className="text-amber-500" size={22} />,
  },
  {
    number: "06",
    title: "Test Understanding with Quizzes",
    desc: "Cement your mastery with conceptual quizzes on invariant checks, edge cases, and runtime constraints.",
    icon: <Award className="text-emerald-500" size={22} />,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-[var(--border)] bg-[var(--surface-elevated)]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
            The Learning Journey
          </span>
          <h2 className="mt-2 font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            How StructuraX Works
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)]">
            A proven pedagogical progression that guides you from initial visual observation to confident algorithmic mastery.
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
        >
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              variants={fadeIn}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] group-hover:border-[var(--primary)]/40 transition-colors">
                    {step.icon}
                  </div>
                  <span className="font-mono text-sm font-bold text-[var(--text-secondary)]">
                    STEP {step.number}
                  </span>
                </div>

                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="mt-6 flex items-center gap-1 text-xs font-mono text-[var(--text-secondary)] opacity-60 group-hover:text-[var(--primary)] group-hover:opacity-100 transition-opacity">
                  <span>Next: Step {STEPS[idx + 1].number}</span>
                  <ArrowRight size={13} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
