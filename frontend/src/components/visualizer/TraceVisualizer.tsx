import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  CornerDownRight,
  ArrowRight,
  ArrowLeftRight,
  Repeat,
  CheckCircle2,
  AlertCircle,
  Gauge,
} from "lucide-react";
import { Button } from "../ui/button";
import type { ExecutionTrace } from "../../lib/api";
import { usePrefersReducedMotion } from "../../hooks/use-reduced-motion";
import { useStudio } from "../../context/StudioContext";

const BASE_STEP_MS = 1200;

interface TraceVisualizerProps {
  trace: ExecutionTrace | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  mode?: "singly" | "doubly" | "circular" | "polynomial";
}

export function TraceVisualizer({
  trace,
  isLoading = false,
  error = null,
  onRetry,
  mode = "singly",
}: TraceVisualizerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { setTraceState } = useStudio();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Auto-detect mode if not explicitly provided
  const activeMode: "singly" | "doubly" | "circular" | "polynomial" =
    mode !== "singly"
      ? mode
      : trace?.operation_id?.startsWith("dll-")
      ? "doubly"
      : trace?.operation_id?.startsWith("cll-") || trace?.final_state?.is_circular
      ? "circular"
      : trace?.operation_id?.startsWith("poly-") || trace?.final_state?.terms !== undefined
      ? "polynomial"
      : "singly";

  // Reset step on new trace
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setPlaybackSpeed(1);
  }, [trace?.operation_id]);

  useEffect(() => {
    setTraceState({ trace, stepIndex: currentStepIndex, isPlaying, speed: playbackSpeed });
  }, [trace, currentStepIndex, isPlaying, playbackSpeed, setTraceState]);

  // Step-by-step playback timer with variable speed
  useEffect(() => {
    if (!isPlaying || !trace || trace.events.length === 0) return;

    if (currentStepIndex >= trace.events.length - 1) {
      setIsPlaying(false);
      return;
    }

    const intervalMs = Math.round(BASE_STEP_MS / playbackSpeed);
    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => Math.min(prev + 1, trace.events.length - 1));
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, trace, playbackSpeed]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/5 p-8 text-center space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
          <AlertCircle size={22} />
        </div>
        <div className="space-y-1">
          <h4 className="font-['Space_Grotesk'] text-sm font-bold text-[var(--text-primary)]">
            Execution Failed
          </h4>
          <p className="text-xs text-[var(--text-secondary)] max-w-md font-mono">
            {error}
          </p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2 text-xs font-mono flex items-center gap-1.5"
          >
            <RotateCcw size={13} /> Retry Operation
          </Button>
        )}
      </div>
    );
  }

  if (!trace) {
    return (
      <div className="flex h-56 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-secondary)] font-mono p-6 text-center space-y-2">
        {isLoading ? (
          <>
            <div className="flex items-center gap-2 text-[var(--primary)] font-semibold">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-ping" />
              <span>Executing on native C engine...</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Generating deterministic memory trace & pointer assignments
            </p>
          </>
        ) : (
          <>
            <span>No active execution trace. Select an operation below.</span>
            <span className="text-[11px] text-[var(--text-secondary)]/70">
              Operations will be executed directly by the compiled C engine.
            </span>
          </>
        )}
      </div>
    );
  }

  const events = trace.events;
  const currentEvent = events[currentStepIndex] || events[0];
  const displayNodes =
    currentStepIndex >= events.length - 1
      ? trace.final_state.nodes ?? []
      : trace.initial_state.nodes ?? [];

  const displayTerms =
    currentStepIndex >= events.length - 1
      ? trace.final_state.terms ?? []
      : trace.initial_state.terms ?? [];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6 shadow-[var(--shadow-card)]">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
            C Engine Trace: {trace.operation}
          </span>
          <span className="rounded bg-[var(--surface-elevated)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--border)]">
            ID: {trace.operation_id}
          </span>
          <span className="rounded bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-mono text-[var(--primary)] uppercase font-semibold border border-[var(--primary)]/20">
            {activeMode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] font-mono mr-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-ping" />
              Running...
            </span>
          )}
          {trace.validation.valid ? (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
              <CheckCircle2 size={13} /> {trace.validation.message}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-rose-500 font-mono">
              <AlertCircle size={13} /> {trace.validation.message}
            </span>
          )}
        </div>
      </div>

      {/* Nodes Canvas */}
      <div className="relative my-4 flex min-h-[160px] w-full items-center justify-start overflow-x-auto py-8 px-2 scrollbar-none">
        {activeMode === "polynomial" ? (
          /* Polynomial Terms Rendering */
          <div className="flex items-center gap-3 md:gap-5 min-w-max">
            {displayTerms.map((term, idx) => (
              <div key={`term-${idx}`} className="flex items-center gap-3">
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-4 flex flex-col items-center">
                  <span className="font-mono text-base font-bold text-[var(--primary)]">
                    {term.coeff >= 0 && idx > 0 ? `+ ${term.coeff}` : term.coeff}
                    {term.exp === 0 ? "" : term.exp === 1 ? "x" : `x^${term.exp}`}
                  </span>
                  <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--border)] text-[9px] font-mono text-[var(--text-secondary)]">
                    <span>COEFF: {term.coeff}</span>
                    <span>EXP: {term.exp}</span>
                  </div>
                </div>
                {idx < displayTerms.length - 1 && (
                  <span className="font-mono text-xs text-[var(--text-secondary)]">+</span>
                )}
              </div>
            ))}
            {trace.final_state.expression && (
              <div className="ml-4 rounded-lg bg-[var(--surface-elevated)] px-3 py-2 border border-[var(--border)] font-mono text-xs text-[var(--accent)] font-semibold">
                = {trace.final_state.expression}
              </div>
            )}
          </div>
        ) : (
          /* Linear / Doubly / Circular Linked List Nodes Rendering */
          <div className="flex items-center gap-3 md:gap-5 min-w-max">
            {displayNodes.map((val, idx) => {
              const isTarget =
                currentEvent?.node_id === `node-${idx}` ||
                (currentEvent?.event_type === "COMPARE" && (currentEvent.payload as any)?.node_value === val);

              const isHead = idx === 0;
              const isTail = idx === displayNodes.length - 1;

              return (
                <div key={`${val}-${idx}`} className="flex items-center gap-3 md:gap-5">
                  <div className="relative flex flex-col items-center">
                    {/* Floating pointer banner */}
                    <AnimatePresence>
                      {isTarget && (
                        <motion.div
                          initial={reducedMotion ? false : { opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute -top-8 z-10 flex items-center gap-1 rounded bg-[var(--primary)] px-2 py-0.5 text-[10px] font-mono font-semibold text-white shadow-md"
                        >
                          <span>{isHead ? "head / curr" : isTail ? "tail / curr" : "curr"}</span>
                          <CornerDownRight size={10} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Node Box */}
                    <motion.div
                      layout={!reducedMotion}
                      initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className={`studio-node flex h-16 ${
                        activeMode === "doubly" ? "w-28 md:w-32" : "w-24 md:w-28"
                      } md:h-18 rounded-xl border overflow-hidden ${
                        isTarget
                          ? "studio-node--active border-[var(--primary)] bg-[var(--surface-elevated)] ring-2 ring-[var(--primary)]/30 shadow-md"
                          : "border-[var(--border-strong)] bg-[var(--surface)]"
                      }`}
                    >
                      {/* PREV compartment for Doubly Linked List */}
                      {activeMode === "doubly" && (
                        <div className="flex w-8 md:w-9 flex-col items-center justify-center border-r border-[var(--border)] bg-black/5 dark:bg-white/5">
                          <span className="text-[9px] font-mono text-[var(--text-secondary)]">PREV</span>
                          <div
                            className={`h-2 w-2 rounded-full ${
                              isTarget ? "bg-[var(--primary)]" : "bg-[var(--text-secondary)]/40"
                            }`}
                          />
                        </div>
                      )}

                      {/* DATA field */}
                      <div className="flex flex-1 flex-col items-center justify-center border-r border-[var(--border)]">
                        <span className="text-[10px] font-mono text-[var(--text-secondary)]">VAL</span>
                        <span className="font-mono text-base md:text-lg font-bold text-[var(--text-primary)]">
                          {val}
                        </span>
                      </div>

                      {/* NEXT pointer compartment */}
                      <div className="flex w-8 md:w-10 flex-col items-center justify-center bg-black/5 dark:bg-white/5">
                        <span className="text-[9px] font-mono text-[var(--text-secondary)]">NEXT</span>
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            isTarget ? "bg-[var(--accent)]" : "bg-[var(--text-secondary)]/40"
                          }`}
                        />
                      </div>
                    </motion.div>

                    {/* Symbolic Address and Head/Tail indicator */}
                    <div className="flex items-center gap-1 mt-1 font-mono text-[10px] text-[var(--text-secondary)]">
                      <span>0x{(0x10 + idx * 0x10).toString(16).toUpperCase()}</span>
                      {isHead && <span className="text-[var(--primary)] font-bold">[HEAD]</span>}
                      {isTail && activeMode === "doubly" && (
                        <span className="text-[var(--accent)] font-bold">[TAIL]</span>
                      )}
                    </div>
                  </div>

                  {/* Inter-node connection arrows */}
                  {idx < displayNodes.length - 1 && (
                    activeMode === "doubly" ? (
                      <motion.span
                        initial={reducedMotion ? false : { opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.24, delay: reducedMotion ? 0 : idx * 0.04 }}
                        className="studio-connection studio-connection--active flex items-center"
                      >
                        <ArrowLeftRight size={18} className="text-[var(--accent)]" />
                      </motion.span>
                    ) : (
                      <motion.span
                        initial={reducedMotion ? false : { opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.24, delay: reducedMotion ? 0 : idx * 0.04 }}
                        className="studio-connection flex items-center"
                      >
                        <ArrowRight size={18} className="text-[var(--text-secondary)]/50" />
                      </motion.span>
                    )
                  )}
                </div>
              );
            })}

            {/* End of List indicator */}
            {activeMode === "circular" ? (
              /* Circular Linked List Return Arrow to Head */
              <div className="flex items-center gap-2 pl-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--primary)]/60 bg-[var(--primary)]/10 px-3 py-1.5 font-mono text-xs font-semibold text-[var(--primary)]">
                  <Repeat size={13} className="animate-spin" />
                  <span>loops to head (0x10)</span>
                </div>
              </div>
            ) : (
              /* Linear List NULL terminator */
              <div className="flex items-center gap-3 pl-1">
                <ArrowRight size={18} className="text-[var(--text-secondary)]/40" />
                <div className="rounded-lg border border-dashed border-[var(--border-strong)] px-3 py-2 font-mono text-xs font-semibold text-[var(--text-secondary)]">
                  NULL
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step Breakdown & Controls */}
      <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Step details banner */}
        <div className="md:col-span-6 flex flex-col justify-center rounded-xl bg-[var(--surface-elevated)] p-3 border border-[var(--border)]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] mb-1">
            <span className="text-[var(--primary)] font-bold">
              EVENT: {currentEvent?.event_type || "IDLE"}
            </span>
            <span>
              Step {currentStepIndex + 1} of {events.length}
            </span>
          </div>
          <p className="text-xs text-[var(--text-primary)] font-mono truncate">
            Node: <span className="text-[var(--accent)]">{currentEvent?.node_id || "global"}</span>{" "}
            | {JSON.stringify(currentEvent?.payload || {})}
          </p>
        </div>

        {/* Playback Controls & Speed */}
        <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-2">
          {/* Step scrubber */}
          {events.length > 1 && (
            <input
              type="range"
              min={0}
              max={events.length - 1}
              value={currentStepIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentStepIndex(Number(e.target.value));
              }}
              className="w-24 md:w-32 h-1.5 rounded-lg appearance-none bg-[var(--surface-elevated)] border border-[var(--border)] cursor-pointer accent-[var(--primary)]"
              title="Scrub steps"
            />
          )}

          {/* Speed Selector */}
          <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-2 py-1 text-xs font-mono">
            <Gauge size={12} className="text-[var(--text-secondary)]" />
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-transparent text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1.0x</option>
              <option value={2}>2.0x</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            title="Reset"
          >
            <RotateCcw size={14} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={currentStepIndex <= 0}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.max(0, prev - 1));
            }}
            title="Step back"
          >
            <SkipBack size={14} />
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={currentStepIndex >= events.length - 1}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.min(events.length - 1, prev + 1));
            }}
            title="Step forward"
          >
            <SkipForward size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
