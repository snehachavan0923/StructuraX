import { motion } from "framer-motion";
import { Bot, User, Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeIn } from "../../../lib/motion";

export function AiTutorPreviewSection() {
  return (
    <section className="py-20 md:py-28 border-t border-[var(--border)] bg-[var(--surface-elevated)]/40 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 h-80 w-80 rounded-full bg-[var(--secondary)] opacity-10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Context & Copy */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--secondary)]/30 bg-[var(--secondary)]/10 px-3 py-1 text-xs font-semibold text-[var(--secondary)] mb-4">
              <Sparkles size={13} />
              <span>Contextual AI Guidance</span>
            </div>

            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
              An AI Tutor That Explains <br />
              <span className="bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] bg-clip-text text-transparent">
                Every Single Pointer Shift
              </span>
            </h2>

            <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-6">
              Stuck on why an AVL rotation happened or why a loop terminated early? StructuraX AI knows
              the exact execution state, call stack depth, and memory addresses on your screen.
            </p>

            <ul className="space-y-3 mb-8 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2.5">
                <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 font-bold text-[10px]">
                  ✓
                </span>
                <span>Context-aware: queries reference your live canvas state.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 font-bold text-[10px]">
                  ✓
                </span>
                <span>Socratic hints that guide you without spoiling solutions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 font-bold text-[10px]">
                  ✓
                </span>
                <span>Analyzes time and space complexity trade-offs instantaneously.</span>
              </li>
            </ul>

            <Link
              to="/curriculum"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              <span>Explore Contextual Learning</span>
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Right Column: Illustrative Chat Mockup */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6 shadow-xl relative">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] text-white shadow-sm">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">StructuraX AI Mentor</h4>
                    <span className="text-[11px] font-mono text-[var(--text-secondary)] flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Attached to: SinglyLinkedList::reverse()
                    </span>
                  </div>
                </div>
                <span className="rounded bg-[var(--surface-elevated)] px-2.5 py-1 text-[11px] font-mono text-[var(--text-secondary)] border border-[var(--border)]">
                  Simulated Preview
                </span>
              </div>

              {/* Chat Conversation Thread */}
              <div className="space-y-4">
                {/* User Message */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="rounded-2xl rounded-tr-sm bg-[var(--primary)] p-3.5 text-xs text-white max-w-[85%] shadow-sm">
                    <p>Why did curr-&gt;next change before curr advanced to the next node? Won't we lose the rest of the list?</p>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] shrink-0">
                    <User size={14} />
                  </div>
                </div>

                {/* AI Tutor Message */}
                <div className="flex items-start gap-3 justify-start">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--secondary)]/15 text-[var(--secondary)] border border-[var(--secondary)]/30 shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-[var(--surface-elevated)] border border-[var(--border)] p-3.5 text-xs text-[var(--text-primary)] max-w-[90%] shadow-sm space-y-2">
                    <p className="leading-relaxed">
                      Great observation! That's why <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[11px] text-[var(--accent)]">nextTemp = curr-&gt;next</code> was saved on line 4 first.
                    </p>
                    <p className="leading-relaxed text-[var(--text-secondary)]">
                      Notice that the pointer to <span className="font-mono text-[var(--primary)]">node 02 (0x2B)</span> is safely anchored by <span className="font-mono text-[var(--accent)]">nextTemp</span>. Reassigning <span className="font-mono">curr-&gt;next = prev</span> reverses the connection backwards toward NULL without severing your link to the remaining elements!
                    </p>
                    <div className="mt-2 rounded-lg bg-[var(--surface)] p-2.5 border border-[var(--border)] flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                      <Sparkles size={13} />
                      <span>Invariant held: Heap allocation remains accessible.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulated Input Area */}
              <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center gap-2">
                <div className="flex-1 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-3.5 py-2 text-xs text-[var(--text-secondary)] font-mono flex items-center justify-between">
                  <span>Ask a question about this step...</span>
                  <MessageSquare size={14} />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-3 text-right">
                <span className="text-[10px] text-[var(--text-secondary)] italic">
                  * Illustrative conversation preview. Live contextual AI tutoring integration scheduled for future phase.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
