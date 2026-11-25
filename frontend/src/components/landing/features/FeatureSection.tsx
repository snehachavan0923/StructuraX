import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  MousePointer2,
  HelpCircle,
  Bug,
  BrainCircuit,
  TrendingUp,
  FileQuestion,
  Play,
  Check,
  RotateCw,
} from "lucide-react";
import { fadeIn, staggerChildren } from "../../../lib/motion";

export function FeatureSection() {
  // Mini interactive state for "Try It Yourself"
  const [stack, setStack] = useState<number[]>([10, 20]);
  const [predictionSelected, setPredictionSelected] = useState<string | null>(null);

  const pushStack = () => {
    if (stack.length < 4) {
      setStack([...stack, (stack.length + 1) * 10]);
    }
  };

  const popStack = () => {
    if (stack.length > 0) {
      setStack(stack.slice(0, -1));
    }
  };

  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--primary)] font-semibold">
            Capabilities
          </span>
          <h2 className="mt-2 font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Designed for Deep Understanding
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)]">
            Every feature is engineered to replace passive video-watching with active computational reasoning.
          </p>
        </div>

        {/* Feature Grid with Varied Visual Layouts */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Feature 1: Interactive DSA Animations (Large Span 7) */}
          <motion.div
            variants={fadeIn}
            className="md:col-span-7 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 flex flex-col justify-between hover:border-[var(--primary)]/50 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--primary)] mb-3">
                <Sparkles size={16} />
                <span>FEATURE 01</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--text-primary)] mb-2">
                Interactive DSA Animations
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                Step backwards, forwards, inspect variable scopes, and witness the state of memory update
                in sync with code execution.
              </p>
            </div>

            {/* Visual preview box: Stepping through binary tree insertion */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-3">
                <span className="flex items-center gap-1.5 text-[var(--accent)] font-semibold">
                  <Play size={12} /> Execution Trace
                </span>
                <span>BST::insert(root, 35)</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full border border-[var(--primary)] bg-[var(--primary)]/10 flex items-center justify-center font-mono text-xs font-bold text-[var(--primary)]">
                    50
                  </div>
                  <div className="w-16 h-4 border-l border-b border-[var(--border-strong)] -mt-1 ml-4" />
                  <div className="h-9 w-9 rounded-full border border-[var(--accent)] bg-[var(--accent)]/15 flex items-center justify-center font-mono text-xs font-bold text-[var(--accent)] shadow-sm animate-pulse">
                    35
                  </div>
                </div>
                <div className="text-xs font-mono bg-[var(--surface)] p-3 rounded-lg border border-[var(--border)] max-w-xs">
                  <div className="text-emerald-500 font-semibold">35 &lt; 50 → Traverse Left</div>
                  <div className="text-[var(--text-secondary)] mt-1">node-&gt;left = insert(node-&gt;left, 35);</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Try It Yourself (Interactive Mini Stack, Span 5) */}
          <motion.div
            variants={fadeIn}
            className="md:col-span-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 flex flex-col justify-between hover:border-[var(--primary)]/50 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--accent)] mb-3">
                <MousePointer2 size={16} />
                <span>FEATURE 02</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--text-primary)] mb-2">
                Try It Yourself
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                Don't just watch — manipulate the structures directly. Test operations and observe immediate visual feedback.
              </p>
            </div>

            {/* Interactive Stack Demonstration */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-3">
                <span>Stack Playground (LIFO)</span>
                <span className="text-[var(--primary)]">size: {stack.length}</span>
              </div>
              
              {/* Stack items container */}
              <div className="w-36 h-28 border-x-2 border-b-2 border-[var(--primary)] rounded-b-md flex flex-col-reverse items-center justify-start p-1.5 gap-1 bg-black/5 dark:bg-white/5">
                {stack.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full py-1 bg-[var(--primary)] text-white text-center font-mono text-xs font-bold rounded shadow-sm"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>

              {/* Stack Controls */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={pushStack}
                  className="px-3 py-1 rounded bg-[var(--primary)] text-white text-xs font-semibold cursor-pointer hover:opacity-90"
                >
                  push()
                </button>
                <button
                  onClick={popStack}
                  className="px-3 py-1 rounded border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] text-xs font-semibold cursor-pointer hover:border-[var(--primary)]"
                >
                  pop()
                </button>
              </div>
            </div>
          </motion.div>

          {/* Feature 3: Predict the Next Step (Span 6) */}
          <motion.div
            variants={fadeIn}
            className="md:col-span-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 flex flex-col justify-between hover:border-[var(--primary)]/50 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--secondary)] mb-3">
                <HelpCircle size={16} />
                <span>FEATURE 03</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)] mb-2">
                Predict the Next Step
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                The visualizer pauses before critical pointer reassignments. You predict what node the pointer points to next.
              </p>
            </div>

            {/* Interactive prediction demonstration */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <span className="text-xs font-mono text-[var(--text-secondary)] block mb-2">
                Challenge: In reverseList(), what does curr-&gt;next become?
              </span>
              <div className="space-y-2">
                {[
                  { id: "optA", text: "prev (reversing pointer direction)", correct: true },
                  { id: "optB", text: "nextTemp (moving forward)", correct: false },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setPredictionSelected(option.id)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ${
                      predictionSelected === option.id
                        ? option.correct
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] text-[var(--text-primary)]"
                    }`}
                  >
                    <span>{option.text}</span>
                    {predictionSelected === option.id && option.correct && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Feature 4: Debugging Challenges (Span 6) */}
          <motion.div
            variants={fadeIn}
            className="md:col-span-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 flex flex-col justify-between hover:border-[var(--primary)]/50 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-500 mb-3">
                <Bug size={16} />
                <span>FEATURE 04</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)] mb-2">
                Debugging Challenges
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                Diagnose faulty data structure states: broken cycles, dangling pointers, and boundary overflow faults.
              </p>
            </div>

            {/* Visual simulation of broken cyclic graph */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold block mb-1">
                  Detected: Infinite Cycle in Floyd's Cycle Test
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  fast == slow at node[0x3F]
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold">
                Fix Link
              </span>
            </div>
          </motion.div>

          {/* Feature 5: Topic-wise Quizzes (Span 4) */}
          <motion.div
            variants={fadeIn}
            className="md:col-span-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between hover:border-[var(--primary)]/50 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-500 mb-2">
                <FileQuestion size={16} />
                <span>FEATURE 05</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)] mb-2">
                Topic-wise Quizzes
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Validate mental models with visual comprehension questions and asymptotic time/space analysis.
              </p>
            </div>
            <div className="rounded-lg bg-[var(--surface-elevated)] p-3 text-xs font-mono text-[var(--text-secondary)] flex items-center justify-between">
              <span>Time Complexity</span>
              <span className="text-[var(--primary)] font-bold">O(log N) vs O(N)</span>
            </div>
          </motion.div>

          {/* Feature 6: AI DSA Tutor (Span 4) */}
          <motion.div
            variants={fadeIn}
            className="md:col-span-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between hover:border-[var(--primary)]/50 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--secondary)] mb-2">
                <BrainCircuit size={16} />
                <span>FEATURE 06</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)] mb-2">
                AI DSA Tutor
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Context-aware guidance that explains why a pointer moved, without just giving away the solution.
              </p>
            </div>
            <div className="rounded-lg bg-[var(--surface-elevated)] p-3 text-xs font-mono text-[var(--accent)] flex items-center gap-2">
              <RotateCw size={13} className="text-[var(--secondary)]" />
              <span>Contextual Step Explanation</span>
            </div>
          </motion.div>

          {/* Feature 7: Learning Progress (Span 4) */}
          <motion.div
            variants={fadeIn}
            className="md:col-span-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between hover:border-[var(--primary)]/50 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--accent)] mb-2">
                <TrendingUp size={16} />
                <span>FEATURE 07</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)] mb-2">
                Learning Progress
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Track mastery across topics, challenge completion, and conceptual strengths systematically.
              </p>
            </div>
            <div className="rounded-lg bg-[var(--surface-elevated)] p-3 flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-secondary)]">Mastery Index</span>
              <span className="text-emerald-500 font-bold">Continuous Mastery</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
