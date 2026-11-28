import { AnimatePresence, motion } from "framer-motion";
import { Activity, Braces, Clock3, Database, Info, Variable } from "lucide-react";
import { useStudio } from "../../context/StudioContext";
import { usePrefersReducedMotion } from "../../hooks/use-reduced-motion";

const CODE_BY_EVENT: Record<string, string> = {
  ALLOCATE_NODE: "node = malloc(sizeof(Node));\nnode->value = value;",
  SET_NEXT: "node->next = current->next;",
  UPDATE_HEAD: "head = node;",
  COMPARE: "if (current->value == target) return current;",
  TRAVERSE: "for (Node *curr = head; curr; curr = curr->next) {",
  DELETE_NODE: "prev->next = target->next;\nfree(target);",
  REVERSE: "prev = curr;\ncurr = next;\nnext = curr->next;",
  OPERATION_COMPLETE: "return head;",
};

function formatValue(value: unknown): string {
  if (value === null) return "NULL";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function StudioInspector() {
  const { traceState, topicTitle } = useStudio();
  const reducedMotion = usePrefersReducedMotion();
  const { trace, stepIndex } = traceState;
  const event = trace?.events[stepIndex] ?? trace?.events[0] ?? null;
  const code = event ? CODE_BY_EVENT[event.event_type] ?? `/* ${event.event_type} */` : "// Waiting for C engine trace";
  const state = event ? trace?.final_state : null;
  const pointers = event?.pointers ?? {};
  const counters = event?.counters ?? {};

  return (
    <section className="studio-inspector flex h-full w-80 flex-col xl:w-96" aria-label="Contextual information panel">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] px-5">
        <div className="flex items-center gap-2">
          <Info size={15} className="text-[var(--accent)]" />
          <h2 className="font-['Space_Grotesk'] text-sm font-bold">Execution Insight</h2>
        </div>
        <span className="rounded border border-[var(--border)] bg-[var(--surface-elevated)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">
          Live
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
        <div className="studio-inspector-block">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            <Activity size={13} className="text-[var(--primary)]" /> Current step
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={event ? `${trace?.operation_id}-${event.step}` : "empty"}
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3"
            >
              <div className="mb-1 flex items-center justify-between font-mono text-[10px] text-[var(--text-secondary)]">
                <span className="font-bold text-[var(--primary)]">{event?.event_type ?? "IDLE"}</span>
                <span>STEP {event?.step ?? 0}</span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--text-primary)]">
                {event
                  ? `${event.event_type.replaceAll("_", " ").toLowerCase()} — trace event ${event.step} of ${trace?.events.length ?? 0}.`
                  : `Run an operation in ${topicTitle} to inspect each C engine step.`}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="studio-inspector-block">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            <Variable size={13} className="text-[var(--accent)]" /> Active pointers & variables
          </div>
          <div className="space-y-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 font-mono text-[11px]">
            {Object.keys(pointers).length === 0 ? (
              <span className="text-[var(--text-secondary)]">No active pointers</span>
            ) : (
              Object.entries(pointers).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-[var(--text-secondary)]">{key}</span>
                  <span className="truncate text-[var(--accent)]">{formatValue(value)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="studio-inspector-block">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            <Database size={13} className="text-[var(--secondary)]" /> Data structure state
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 font-mono text-[11px] text-[var(--text-primary)]">
            {state ? (
              <pre className="whitespace-pre-wrap break-words text-[10px] leading-relaxed">
                {JSON.stringify(state, null, 2)}
              </pre>
            ) : (
              <span className="text-[var(--text-secondary)]">Awaiting trace snapshot</span>
            )}
          </div>
        </div>

        <div className="studio-inspector-block">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            <Clock3 size={13} className="text-[var(--success)]" /> Complexity
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-2">
              <div className="text-[9px] uppercase text-[var(--text-secondary)]">Time</div>
              <div className="font-mono text-xs font-bold text-[var(--text-primary)]">
                {event?.event_type === "COMPARE" || event?.event_type === "TRAVERSE" ? "O(n)" : "O(1)"}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-2">
              <div className="text-[9px] uppercase text-[var(--text-secondary)]">Space</div>
              <div className="font-mono text-xs font-bold text-[var(--text-primary)]">
                {event?.event_type === "ALLOCATE_NODE" ? "O(n)" : "O(1)"}
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-[var(--text-secondary)]">
            <span>visits {counters.visits ?? 0}</span>
            <span>allocations {counters.allocations ?? 0}</span>
          </div>
        </div>

        <div className="studio-inspector-block">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            <Braces size={13} className="text-[var(--primary)]" /> C code inspector
          </div>
          <pre className="max-h-52 overflow-auto rounded-xl border border-[var(--border)] bg-[#0A101C] p-3 font-mono text-[10px] leading-relaxed text-[var(--accent)]">
            {code}
          </pre>
          <p className="mt-1.5 text-[10px] leading-relaxed text-[var(--text-secondary)]">
            Read-only. Synchronized to the current C engine trace event.
          </p>
        </div>
      </div>
    </section>
  );
}
