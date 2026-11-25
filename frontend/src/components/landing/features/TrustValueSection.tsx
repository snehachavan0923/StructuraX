import { motion } from "framer-motion";
import { Eye, MousePointerClick, HelpCircle, Bug, CheckCircle2 } from "lucide-react";
import { fadeIn, staggerChildren } from "../../../lib/motion";

const PILLARS = [
  {
    step: "01",
    title: "Visualize",
    subtitle: "Pointers & Memory",
    desc: "See exact heap allocations, pointer dereferences, and state changes frame-by-frame.",
    icon: <Eye className="text-[var(--primary)]" size={20} />,
  },
  {
    step: "02",
    title: "Interact",
    subtitle: "Hands-on Operations",
    desc: "Manipulate nodes, adjust pointers, and trigger operations to build muscle memory.",
    icon: <MousePointerClick className="text-[var(--accent)]" size={20} />,
  },
  {
    step: "03",
    title: "Predict",
    subtitle: "Active Recall",
    desc: "Pause mid-algorithm and predict what line executes next before the state commits.",
    icon: <HelpCircle className="text-[var(--secondary)]" size={20} />,
  },
  {
    step: "04",
    title: "Debug",
    subtitle: "Fix Broken States",
    desc: "Diagnose cyclic lists, memory leaks, null references, and boundary edge cases.",
    icon: <Bug className="text-amber-500" size={20} />,
  },
  {
    step: "05",
    title: "Understand",
    subtitle: "True Mastery",
    desc: "Connect abstract theoretical proofs with concrete computational intuition.",
    icon: <CheckCircle2 className="text-emerald-500" size={20} />,
  },
];

export function TrustValueSection() {
  return (
    <section className="py-14 border-y border-[var(--border)] bg-[var(--surface-elevated)]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Core Philosophy
          </span>
          <h2 className="mt-1 font-['Space_Grotesk'] text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            The 5 Pillars of Visual Mastery
          </h2>
        </div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {PILLARS.map((item) => (
            <motion.div
              key={item.step}
              variants={fadeIn}
              className="group relative flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] transition-colors group-hover:border-[var(--primary)]/40">
                    {item.icon}
                  </div>
                  <span className="font-mono text-xs font-semibold text-[var(--text-secondary)]">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <span className="text-xs font-mono text-[var(--text-secondary)] block mb-2">
                  {item.subtitle}
                </span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
