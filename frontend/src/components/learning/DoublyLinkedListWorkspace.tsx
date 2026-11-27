import { useState, useEffect } from "react";
import {
  runExecution,
  checkPrediction,
  checkDebugging,
  submitQuiz,
  DllOperationType,
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

export function DoublyLinkedListWorkspace() {
  const [activeTab, setActiveTab] = useState<
    "concept" | "animation" | "try" | "predict" | "debug" | "quiz" | "ai" | "progress"
  >("animation");

  // Core List State
  const [currentList, setCurrentList] = useState<number[]>([10, 20, 30]);
  const [activeTrace, setActiveTrace] = useState<ExecutionTrace | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inputs for Try It Yourself
  const [inputValue, setInputValue] = useState<number>(5);
  const [inputPosition] = useState<number>(1);
  const [targetValue] = useState<number>(20);
  const [searchTarget, setSearchTarget] = useState<number>(20);

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
    op: DllOperationType,
    val?: number,
    pos?: number,
    tVal?: number,
    overrideList?: number[],
  ) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const trace = await runExecution({
        topic: "doubly_linked_list",
        operation: op,
        current_list: overrideList ?? currentList,
        value: val ?? inputValue,
        position: pos ?? inputPosition,
        target_value: tVal ?? targetValue,
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
    handleExecute(DllOperationType.DISPLAY, 0, 0, 0, [10, 20, 30]);
  }, []);

  // Predict step check
  const handlePredictionSubmit = async (optionId: string) => {
    setSelectedPrediction(optionId);
    try {
      const res = await checkPrediction("pred_dll_insert_front", optionId, "doubly_linked_list");
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
      const res = await checkDebugging("debug_dll_broken_prev", action, "doubly_linked_list");
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
      const res = await submitQuiz(quizAnswers, "doubly_linked_list");
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
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
            Module 02 · Bidirectional Data Structures
          </span>
          <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Doubly Linked List
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Connected to Native C DSA Engine · Bidirectional Pointer Sync
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
                  ? "bg-[var(--accent)] text-white shadow-sm"
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
              Doubly Linked List Foundations
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              A <strong>Doubly Linked List</strong> expands on the singly linked list by allocating two pointer fields
              per node: one pointing forward to the <code>next</code> node, and one pointing backward to the <code>prev</code> node.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <h4 className="font-mono text-xs font-bold text-[var(--primary)] uppercase mb-1">
                  1. Previous Pointer (PREV)
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Points to the preceding node in memory, or <code>NULL</code> if this is the head. Enables O(1) backward traversal.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <h4 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase mb-1">
                  2. Data Field (VAL)
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Contains the node's stored payload or element.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <h4 className="font-mono text-xs font-bold text-[var(--accent)] uppercase mb-1">
                  3. Next Pointer (NEXT)
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Points to the subsequent node in memory, or <code>NULL</code> if this is the tail.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)]">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-[var(--text-primary)] mb-2">
                Time & Space Complexities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] block">Insert Front:</span>
                  <span className="text-emerald-500 font-bold">O(1)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] block">Insert Back:</span>
                  <span className="text-emerald-500 font-bold">O(1) (with tail)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] block">Delete by Ref:</span>
                  <span className="text-emerald-500 font-bold">O(1)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] block">Aux Space:</span>
                  <span className="text-emerald-500 font-bold">O(n)</span>
                </div>
              </div>
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
            onRetry={() => handleExecute(DllOperationType.DISPLAY, 0, 0, 0, currentList)}
            mode="doubly"
          />

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <span className="text-xs font-mono font-semibold text-[var(--text-secondary)] uppercase block mb-3">
              Trigger C Engine Demonstrations
            </span>
            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleExecute(DllOperationType.INSERT_FRONT, 5)}
                disabled={loading}
              >
                Insert 5 at Front
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(DllOperationType.INSERT_BACK, 40)}
                disabled={loading}
              >
                Insert 40 at Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(DllOperationType.DELETE_FRONT)}
                disabled={loading || currentList.length === 0}
              >
                Delete Front Node
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(DllOperationType.DELETE_BACK)}
                disabled={loading || currentList.length === 0}
              >
                Delete Back Node
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(DllOperationType.TRAVERSE_FORWARD)}
                disabled={loading}
              >
                Traverse Forward
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(DllOperationType.TRAVERSE_BACKWARD)}
                disabled={loading}
              >
                Traverse Backward
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleExecute(DllOperationType.REVERSE)}
                disabled={loading || currentList.length === 0}
              >
                Reverse DLL
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExecute(DllOperationType.MERGE, 99)}
                disabled={loading}
              >
                Merge List (99)
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
            onRetry={() => handleExecute(DllOperationType.DISPLAY, 0, 0, 0, currentList)}
            mode="doubly"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Insertion Box */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--accent)]">
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
                  onClick={() => handleExecute(DllOperationType.INSERT_FRONT, inputValue)}
                  disabled={loading}
                >
                  Front
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleExecute(DllOperationType.INSERT_BACK, inputValue)}
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
                Safely disconnect prev/next pointers and free memory in C.
              </p>
              <div className="flex gap-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleExecute(DllOperationType.DELETE_FRONT)}
                  disabled={loading || currentList.length === 0}
                >
                  Delete Front
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleExecute(DllOperationType.DELETE_BACK)}
                  disabled={loading || currentList.length === 0}
                >
                  Delete Back
                </Button>
              </div>
            </div>

            {/* Search Box */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--primary)]">
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
                onClick={() => handleExecute(DllOperationType.SEARCH, searchTarget)}
                disabled={loading}
              >
                Search in DLL
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: PREDICT THE NEXT STEP */}
      {activeTab === "predict" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent)]">
            <HelpCircle size={16} /> Doubly Linked Active Recall
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Predict the Previous Pointer Assignment
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Scenario: When prepending a new node to the front of a non-empty Doubly Linked List,
            which pointer assignment establishes the backward link from the old head?
          </p>

          <div className="space-y-3 pt-2">
            {[
              { id: "opt_head_prev", code: "head->prev = new_node;" },
              { id: "opt_new_prev", code: "new_node->prev = head;" },
              { id: "opt_tail_prev", code: "tail->prev = new_node;" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handlePredictionSubmit(opt.id)}
                className={`w-full p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between ${
                  selectedPrediction === opt.id
                    ? "border-[var(--accent)] bg-[var(--surface-elevated)]"
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
            <Bug size={16} /> Bug Repair Challenge
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Fix the Dangling Backward Pointer
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            A developer deleted a middle node but forgot to update the subsequent node's <code>prev</code> pointer.
            Running backward traversal hits invalid memory! Select the corrective pointer action:
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDebugFix("relink_prev")}
            >
              curr-&gt;next-&gt;prev = curr
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDebugFix("wrong_action")}
            >
              curr-&gt;prev = curr-&gt;next
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
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent)]">
            <FileQuestion size={16} /> Doubly Linked List Assessment
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Topic Knowledge Quiz
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-2">
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                1. What pointer fields are stored inside every node of a Doubly Linked List?
              </p>
              <div className="space-y-1.5 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q1"
                    checked={quizAnswers["q1"] === "q1_opt_b"}
                    onChange={() => setQuizAnswers({ ...quizAnswers, q1: "q1_opt_b" })}
                  />
                  <span>Data + Prev pointer + Next pointer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q1"
                    checked={quizAnswers["q1"] === "q1_opt_a"}
                    onChange={() => setQuizAnswers({ ...quizAnswers, q1: "q1_opt_a" })}
                  />
                  <span>Data + Next pointer only</span>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-2">
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                2. What is the time complexity to delete a node when a direct pointer reference to it is provided?
              </p>
              <div className="space-y-1.5 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q2"
                    checked={quizAnswers["q2"] === "q2_opt_b"}
                    onChange={() => setQuizAnswers({ ...quizAnswers, q2: "q2_opt_b" })}
                  />
                  <span>O(1)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="q2"
                    checked={quizAnswers["q2"] === "q2_opt_a"}
                    onChange={() => setQuizAnswers({ ...quizAnswers, q2: "q2_opt_a" })}
                  />
                  <span>O(n)</span>
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
                {quizResult.passed ? "Mastery demonstrated on Doubly Linked Lists!" : "Review bidirectional pointer invariants."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* STAGE 7: AI TUTOR */}
      {activeTab === "ai" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent)]">
            <Bot size={16} /> Deterministic Intelligent Mentor
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            DLL Invariants & Tradeoffs
          </h2>
          <div className="space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed">
            <p>
              <strong>Memory Overhead:</strong> Each DLL node stores two pointers (16 bytes on 64-bit systems) compared to one in SLL (8 bytes).
            </p>
            <p>
              <strong>Bi-directional Traversal:</strong> Enables LRU caches, browser history forward/back navigation, and O(1) removals.
            </p>
          </div>
        </div>
      )}

      {/* STAGE 8: PROGRESS */}
      {activeTab === "progress" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent)]">
            <TrendingUp size={16} /> Topic Progress
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Module 02 Completion Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono pt-2">
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <span className="text-[var(--text-secondary)] block">Operations:</span>
              <span className="text-base font-bold text-[var(--text-primary)]">{progress.operationsExplored}</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <span className="text-[var(--text-secondary)] block">Quiz Score:</span>
              <span className="text-base font-bold text-[var(--accent)]">{progress.quizScore}/2</span>
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
