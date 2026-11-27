import { useState, useEffect } from "react";
import {
  runExecution,
  checkPrediction,
  checkDebugging,
  submitQuiz,
  CllOperationType,
} from "../../lib/api";
import type { ExecutionTrace } from "../../lib/api";
import { TraceVisualizer } from "../../components/visualizer/TraceVisualizer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/form-controls";
import {
  BookOpen,
  Play,
  MousePointer2,
  HelpCircle,
  Bug,
  FileQuestion,
  Bot,
  TrendingUp,
  Plus,
  Trash2,
  Search,
  Check,
  X,
} from "lucide-react";

export function CircularLinkedListWorkspace() {
  const [activeTab, setActiveTab] = useState<
    "concept" | "animation" | "try" | "predict" | "debug" | "quiz" | "ai" | "progress"
  >("animation");

  // Core List State
  const [currentList, setCurrentList] = useState<number[]>([12, 24, 36]);
  const [activeTrace, setActiveTrace] = useState<ExecutionTrace | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inputs for Try It Yourself
  const [inputValue, setInputValue] = useState<number>(6);
  const [inputPosition] = useState<number>(1);
  const [searchTarget, setSearchTarget] = useState<number>(24);

  // Predict state
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);

  // Debugging state
  const [debugResolved, setDebugResolved] = useState(false);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    explanations: Record<string, string>;
  } | null>(null);

  // Progress metrics
  const [progress, setProgress] = useState({
    conceptsViewed: true,
    operationsExplored: 3,
    interactiveAttempts: 1,
    predictionsAnswered: 0,
    debuggingCompleted: 0,
    quizScore: 0,
  });

  // Execute C Engine Operation
  const handleExecute = async (
    op: CllOperationType,
    val?: number,
    pos?: number,
    overrideList?: number[],
  ) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const trace = await runExecution({
        topic: "circular_linked_list",
        operation: op,
        current_list: overrideList ?? currentList,
        value: val ?? inputValue,
        position: pos ?? inputPosition,
      });
      setActiveTrace(trace);
      if (trace.validation.valid && trace.final_state.nodes) {
        setCurrentList(trace.final_state.nodes);
        setProgress((prev) => ({
          ...prev,
          operationsExplored: Math.max(prev.operationsExplored + 1, 4),
          interactiveAttempts: prev.interactiveAttempts + 1,
        }));
      }
    } catch (err: any) {
      console.error("Execution failed:", err);
      const detail =
        err.response?.data?.error?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to connect to StructuraX backend C engine. Ensure backend is running.";
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  // Automatically load initial list trace on mount
  useEffect(() => {
    handleExecute(CllOperationType.DISPLAY, 0, 0, [12, 24, 36]);
  }, []);

  // Predict step check
  const handlePredictionSubmit = async (optionId: string) => {
    setSelectedPrediction(optionId);
    try {
      const res = await checkPrediction("pred_cll_insert_front", optionId, "circular_linked_list");
      setPredictionFeedback({
        correct: res.is_correct,
        explanation: res.explanation,
      });
      if (res.is_correct) {
        setProgress((prev) => ({
          ...prev,
          predictionsAnswered: prev.predictionsAnswered + 1,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Debugging challenge check
  const handleDebugFix = async (action: string) => {
    try {
      const res = await checkDebugging("debug_cll_broken_cycle", action, "circular_linked_list");
      setDebugResolved(res.resolved);
      setDebugMessage(res.message);
      if (res.resolved) {
        setCurrentList(res.fixed_state);
        setProgress((prev) => ({
          ...prev,
          debuggingCompleted: prev.debuggingCompleted + 1,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quiz submit
  const handleQuizSubmit = async () => {
    try {
      const res = await submitQuiz(quizAnswers, "circular_linked_list");
      setQuizResult({
        score: res.score,
        total: res.total,
        passed: res.passed,
        explanations: res.explanations,
      });
      setProgress((prev) => ({ ...prev, quizScore: res.score }));
    } catch (err) {
      console.error(err);
    }
  };

  const navStages = [
    { id: "concept", label: "1. Concept", icon: BookOpen },
    { id: "animation", label: "2. Watch Animation", icon: Play },
    { id: "try", label: "3. Try It Yourself", icon: MousePointer2 },
    { id: "predict", label: "4. Predict Step", icon: HelpCircle },
    { id: "debug", label: "5. Debugging", icon: Bug },
    { id: "quiz", label: "6. Topic Quiz", icon: FileQuestion },
    { id: "ai", label: "7. AI Tutor", icon: Bot },
    { id: "progress", label: "8. Progress", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--primary)] font-semibold">
            Module 03 · Closed Cycle Structures
          </span>
          <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Circular Linked List
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Connected to Native C DSA Engine · Guaranteed Loop Invariant
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            C Engine Ready
          </span>
        </div>
      </div>

      {/* Stage Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[var(--border)] pb-2 scrollbar-none">
        {navStages.map((stage) => {
          const Icon = stage.icon;
          const isActive = activeTab === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveTab(stage.id as any)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon size={14} />
              <span>{stage.label}</span>
            </button>
          );
        })}
      </div>

      {/* STAGE 1: LEARN CONCEPT */}
      {activeTab === "concept" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-4">
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
              Circular Linked List Foundations
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              In a <strong>Circular Linked List</strong>, there is no <code>NULL</code> pointer marking the end of the chain.
              Instead, the final node's <code>next</code> pointer wraps around and points back directly to the <code>head</code> node.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <h4 className="font-mono text-xs font-bold text-[var(--primary)] uppercase mb-1">
                  1. Circular Invariant
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  <code>tail-&gt;next == head</code> holds true for all lists with size &gt; 0. A single node points to itself.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <h4 className="font-mono text-xs font-bold text-[var(--accent)] uppercase mb-1">
                  2. Traversal Termination
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Loops must terminate when <code>curr-&gt;next == head</code> (or via do-while) to prevent infinite loops.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)]">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-[var(--text-primary)] mb-2">
                Real-world Applications
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                Used in round-robin CPU scheduling, turn-based multiplayer games, cyclic playlist looping, and buffering.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: WATCH ANIMATION */}
      {activeTab === "animation" && (
        <div className="space-y-6">
          <TraceVisualizer
            trace={activeTrace}
            isLoading={loading}
            error={errorMessage}
            onRetry={() => handleExecute(CllOperationType.DISPLAY, 0, 0, currentList)}
            mode="circular"
          />

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <span className="text-xs font-mono font-semibold text-[var(--text-secondary)] uppercase block mb-3">
              Trigger C Engine Demonstrations
            </span>
            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleExecute(CllOperationType.INSERT_FRONT, 6)}
                disabled={loading}
              >
                Insert 6 at Front
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(CllOperationType.INSERT_BACK, 48)}
                disabled={loading}
              >
                Insert 48 at Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(CllOperationType.DELETE_FRONT)}
                disabled={loading || currentList.length === 0}
              >
                Delete Front Node
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(CllOperationType.DELETE_BACK)}
                disabled={loading || currentList.length === 0}
              >
                Delete Back Node
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(CllOperationType.TRAVERSE)}
                disabled={loading}
              >
                Traverse Circle
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleExecute(CllOperationType.REVERSE)}
                disabled={loading || currentList.length === 0}
              >
                Reverse Circular List
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExecute(CllOperationType.MERGE, 77)}
                disabled={loading}
              >
                Merge List (77)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: TRY IT YOURSELF */}
      {activeTab === "try" && (
        <div className="space-y-6">
          <TraceVisualizer
            trace={activeTrace}
            isLoading={loading}
            error={errorMessage}
            onRetry={() => handleExecute(CllOperationType.DISPLAY, 0, 0, currentList)}
            mode="circular"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Insertion Box */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--primary)]">
                <Plus size={14} /> Insert Node
              </div>
              <div>
                <label className="text-[11px] font-mono text-[var(--text-secondary)] block mb-1">
                  Value:
                </label>
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(Number(e.target.value))}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleExecute(CllOperationType.INSERT_FRONT, inputValue)}
                  disabled={loading}
                >
                  Front
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleExecute(CllOperationType.INSERT_BACK, inputValue)}
                  disabled={loading}
                >
                  Back
                </Button>
              </div>
            </div>

            {/* Deletion Box */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-500">
                <Trash2 size={14} /> Delete Node
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Delete node and maintain circular linkage in compiled C.
              </p>
              <div className="flex gap-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleExecute(CllOperationType.DELETE_FRONT)}
                  disabled={loading || currentList.length === 0}
                >
                  Delete Front
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleExecute(CllOperationType.DELETE_BACK)}
                  disabled={loading || currentList.length === 0}
                >
                  Delete Back
                </Button>
              </div>
            </div>

            {/* Search Box */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--accent)]">
                <Search size={14} /> Search Value
              </div>
              <div>
                <label className="text-[11px] font-mono text-[var(--text-secondary)] block mb-1">
                  Target Value:
                </label>
                <Input
                  type="number"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(Number(e.target.value))}
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center mt-2"
                onClick={() => handleExecute(CllOperationType.SEARCH, searchTarget)}
                disabled={loading}
              >
                Search in Circle
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: PREDICT THE NEXT STEP */}
      {activeTab === "predict" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--primary)]">
            <HelpCircle size={16} /> Circular Active Recall
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Predict the Circular Connection
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Scenario: When prepending a new node to the front of a Circular Linked List,
            which pointer assignment ensures the circle remains closed?
          </p>

          <div className="space-y-3 pt-2">
            {[
              { id: "opt_tail_next", code: "tail->next = new_node;" },
              { id: "opt_null_next", code: "tail->next = NULL;" },
              { id: "opt_self_loop", code: "new_node->next = new_node;" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handlePredictionSubmit(opt.id)}
                className={`w-full p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between ${
                  selectedPrediction === opt.id
                    ? "border-[var(--primary)] bg-[var(--surface-elevated)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                }`}
              >
                <code>{opt.code}</code>
                {selectedPrediction === opt.id && predictionFeedback && (
                  predictionFeedback.correct ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-bold">
                      <Check size={14} /> Correct!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-500 font-bold">
                      <X size={14} /> Incorrect
                    </span>
                  )
                )}
              </button>
            ))}
          </div>

          {predictionFeedback && (
            <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)]">
              {predictionFeedback.explanation}
            </div>
          )}
        </div>
      )}

      {/* STAGE 5: DEBUGGING */}
      {activeTab === "debug" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-500">
            <Bug size={16} /> Loop Repair Challenge
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Fix the Broken Circular Connection
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            A function inadvertently assigned <code>tail-&gt;next = NULL</code> instead of closing the circle.
            Restore the circular invariant by executing the correct action:
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDebugFix("close_circle")}
            >
              tail-&gt;next = head
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDebugFix("wrong_action")}
            >
              head = tail-&gt;next
            </Button>
          </div>

          {debugMessage && (
            <div className={`p-4 rounded-xl border text-xs font-mono ${
              debugResolved
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-rose-500/30 bg-rose-500/10 text-rose-500"
            }`}>
              {debugMessage}
            </div>
          )}
        </div>
      )}

      {/* STAGE 6: TOPIC QUIZ */}
      {activeTab === "quiz" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--primary)]">
            <FileQuestion size={16} /> Circular Linked List Assessment
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Topic Knowledge Quiz
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-2">
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                1. What does the next pointer of the final node point to in a circular linked list?
              </p>
              <div className="space-y-1.5 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q1"
                    checked={quizAnswers["q1"] === "q1_opt_a"}
                    onChange={() => setQuizAnswers({ ...quizAnswers, q1: "q1_opt_a" })}
                  />
                  <span>Points back to the head node</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q1"
                    checked={quizAnswers["q1"] === "q1_opt_b"}
                    onChange={() => setQuizAnswers({ ...quizAnswers, q1: "q1_opt_b" })}
                  />
                  <span>Points to NULL</span>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-2">
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                2. Which operating system mechanism is naturally implemented via a circular linked list?
              </p>
              <div className="space-y-1.5 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q3"
                    checked={quizAnswers["q3"] === "q3_opt_b"}
                    onChange={() => setQuizAnswers({ ...quizAnswers, q3: "q3_opt_b" })}
                  />
                  <span>Round-robin CPU process scheduling</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q3"
                    checked={quizAnswers["q3"] === "q3_opt_a"}
                    onChange={() => setQuizAnswers({ ...quizAnswers, q3: "q3_opt_a" })}
                  />
                  <span>Disk defragmentation</span>
                </label>
              </div>
            </div>
          </div>

          <Button variant="primary" size="sm" onClick={handleQuizSubmit}>
            Submit Assessment
          </Button>

          {quizResult && (
            <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono">
              <span className="font-bold block mb-1">
                Score: {quizResult.score} / {quizResult.total} ({quizResult.passed ? "PASSED" : "RETRY"})
              </span>
              <p className="text-[var(--text-secondary)]">
                {quizResult.passed ? "Mastery demonstrated on Circular Linked Lists!" : "Review circular loop termination invariants."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* STAGE 7: AI TUTOR */}
      {activeTab === "ai" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--primary)]">
            <Bot size={16} /> Circular Cycle Explainer
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Preventing Infinite Loops in CLL
          </h2>
          <div className="space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed">
            <p>
              <strong>Termination Condition:</strong> A linear list loop checks <code>curr != NULL</code>. In a circular list,
              checking <code>curr != NULL</code> results in an infinite loop! Instead, inspect <code>curr-&gt;next != head</code>.
            </p>
          </div>
        </div>
      )}

      {/* STAGE 8: PROGRESS */}
      {activeTab === "progress" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--primary)]">
            <TrendingUp size={16} /> Topic Progress
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Module 03 Completion Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono pt-2">
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <span className="text-[var(--text-secondary)] block">Operations:</span>
              <span className="text-base font-bold text-[var(--text-primary)]">{progress.operationsExplored}</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <span className="text-[var(--text-secondary)] block">Quiz Score:</span>
              <span className="text-base font-bold text-[var(--primary)]">{progress.quizScore}/2</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <span className="text-[var(--text-secondary)] block">Debugging:</span>
              <span className="text-base font-bold text-emerald-500">{progress.debuggingCompleted > 0 ? "Resolved" : "Pending"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
