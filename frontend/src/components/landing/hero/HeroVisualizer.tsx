import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ArrowRight, CornerDownRight, Cpu, Layers } from "lucide-react";
import { usePrefersReducedMotion } from "../../../hooks/use-reduced-motion";

interface NodeItem {
  id: string;
  value: number;
  label: string;
  isNew?: boolean;
}

const INITIAL_NODES: NodeItem[] = [
  { id: "n1", value: 14, label: "0x1A" },
  { id: "n2", value: 29, label: "0x2B" },
  { id: "n3", value: 42, label: "0x3C" },
  { id: "n4", value: 67, label: "0x4D" },
];

export function HeroVisualizer() {
  const reducedMotion = usePrefersReducedMotion();
  const [nodes, setNodes] = useState<NodeItem[]>(INITIAL_NODES);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activePointer, setActivePointer] = useState<string>("curr");
  const [activeTargetIndex, setActiveTargetIndex] = useState<number>(1);
  const [stackItems, setStackItems] = useState<number[]>([14, 29]);

  // Visual simulation steps for illustrative demo
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % 4;
        if (next === 0) {
          setNodes(INITIAL_NODES);
          setActiveTargetIndex(0);
          setActivePointer("head");
          setStackItems([14]);
        } else if (next === 1) {
          setActiveTargetIndex(1);
          setActivePointer("curr");
          setStackItems([14, 29]);
        } else if (next === 2) {
          setActiveTargetIndex(2);
          setActivePointer("curr -> next");
          setStackItems([14, 29, 42]);
        } else if (next === 3) {
          setActiveTargetIndex(3);
          setActivePointer("tail");
          setStackItems([14, 29, 42, 67]);
        }
        return next;
      });
    }, 2400);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleReset = () => {
    setNodes(INITIAL_NODES);
    setActiveStep(0);
    setActiveTargetIndex(0);
    setActivePointer("head");
    setStackItems([14]);
  };

  const handleManualInsert = () => {
    if (nodes.length < 5) {
      const newNode: NodeItem = {
        id: `n-${Date.now()}`,
        value: 88,
        label: "0x5E",
        isNew: true,
      };
      setNodes([...nodes, newNode]);
      setActiveTargetIndex(nodes.length);
      setActivePointer("newNode");
      setStackItems((prev) => [...prev, 88]);
    } else {
      handleReset();
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-7 shadow-[var(--shadow-card)] overflow-hidden">
      {/* Background ambient grid & glow */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--primary)] opacity-[0.14] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--secondary)] opacity-[0.12] blur-3xl"
        aria-hidden="true"
      />

      {/* Header bar / Window mockup */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <div className="ml-3 flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
            <Cpu size={14} className="text-[var(--accent)]" />
            <span>visualizer::singly_linked_list::traverse()</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Preview Simulation
          </span>
        </div>
      </div>

      {/* Linked List Canvas Area */}
      <div className="relative my-4 flex min-h-[170px] w-full items-center justify-start overflow-x-auto py-8 px-2 scrollbar-none">
        <div className="flex items-center gap-3 md:gap-5 min-w-max">
          {nodes.map((node, index) => {
            const isActive = activeTargetIndex === index;
            return (
              <div key={node.id} className="flex items-center gap-3 md:gap-5">
                {/* Node Box */}
                <div className="relative flex flex-col items-center">
                  {/* Floating Pointer Badge */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={reducedMotion ? false : { opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -top-9 z-10 flex items-center gap-1 rounded bg-[var(--primary)] px-2 py-0.5 text-[10px] font-mono font-semibold text-white shadow-md"
                      >
                        <span>{activePointer}</span>
                        <CornerDownRight size={10} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Node Body with value and next pointer slot */}
                  <motion.div
                    animate={
                      isActive && !reducedMotion
                        ? { scale: [1, 1.05, 1], borderColor: "var(--primary)" }
                        : {}
                    }
                    transition={{ duration: 0.4 }}
                    className={`flex h-16 w-24 md:h-18 md:w-28 rounded-xl border transition-all duration-200 overflow-hidden ${
                      isActive
                        ? "border-[var(--primary)] bg-[var(--surface-elevated)] ring-2 ring-[var(--primary)]/30 shadow-lg"
                        : "border-[var(--border-strong)] bg-[var(--surface)] hover:border-[var(--primary)]/60"
                    }`}
                  >
                    {/* Data segment */}
                    <div className="flex flex-1 flex-col items-center justify-center border-r border-[var(--border)] bg-gradient-to-b from-transparent to-[var(--surface-hover)]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                        VAL
                      </span>
                      <span className="font-mono text-base md:text-lg font-bold text-[var(--text-primary)]">
                        {node.value}
                      </span>
                    </div>

                    {/* Pointer segment */}
                    <div className="flex w-8 md:w-10 flex-col items-center justify-center bg-black/5 dark:bg-white/5">
                      <span className="text-[9px] font-mono text-[var(--text-secondary)]">NEXT</span>
                      <div
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${
                          isActive
                            ? "bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
                            : "bg-[var(--text-secondary)]/40"
                        }`}
                      />
                    </div>
                  </motion.div>

                  {/* Memory Address Tag */}
                  <span className="mt-1.5 font-mono text-[10px] text-[var(--text-secondary)]">
                    {node.label}
                  </span>
                </div>

                {/* Arrow Connector between nodes */}
                {index < nodes.length - 1 && (
                  <div className="relative flex items-center justify-center text-[var(--text-secondary)]">
                    <motion.div
                      animate={
                        isActive && !reducedMotion
                          ? { x: [0, 4, 0], color: "var(--primary)" }
                          : {}
                      }
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <ArrowRight size={20} className={isActive ? "text-[var(--primary)]" : "opacity-40"} />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Null Pointer Terminator */}
          <div className="flex items-center gap-3 pl-1">
            <ArrowRight size={18} className="text-[var(--text-secondary)]/40" />
            <div className="rounded-lg border border-dashed border-[var(--border-strong)] px-3 py-2 font-mono text-xs font-semibold text-[var(--text-secondary)]">
              NULL
            </div>
          </div>
        </div>
      </div>

      {/* Execution Monitor & Mini-Stack Preview */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-[var(--border)]">
        {/* Step Status */}
        <div className="flex flex-col justify-center rounded-xl bg-[var(--surface-elevated)] p-3 border border-[var(--border)]">
          <span className="text-[11px] font-mono uppercase text-[var(--text-secondary)]">
            Execution Step
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-sm font-bold text-[var(--primary)]">
              Step {activeStep + 1} of 4
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              {activeStep === 0 && "Initializing head pointer"}
              {activeStep === 1 && "Comparing target node"}
              {activeStep === 2 && "Dereferencing curr->next"}
              {activeStep === 3 && "Tail reached & verified"}
            </span>
          </div>
        </div>

        {/* Call Stack / Memory representation */}
        <div className="flex flex-col justify-center rounded-xl bg-[var(--surface-elevated)] p-3 border border-[var(--border)]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <Layers size={12} /> Call Stack
            </span>
            <span>depth: {stackItems.length}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 overflow-hidden">
            {stackItems.map((val, idx) => (
              <span
                key={idx}
                className="rounded bg-[var(--surface)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--accent)] border border-[var(--border)]"
              >
                visit({val})
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center justify-between md:justify-end gap-2 rounded-xl bg-[var(--surface-elevated)] p-3 border border-[var(--border)]">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--primary)] transition-all cursor-pointer"
            aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? "Pause" : "Simulate"}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--primary)] transition-all cursor-pointer"
            aria-label="Reset simulation"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            onClick={handleManualInsert}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-all cursor-pointer shadow-sm"
          >
            <span>+ Insert</span>
          </button>
        </div>
      </div>

      <div className="mt-3 text-right">
        <span className="text-[10px] text-[var(--text-secondary)] italic">
          * Presentation-only demonstration. Actual C engine execution runs in interactive learning modules.
        </span>
      </div>
    </div>
  );
}
