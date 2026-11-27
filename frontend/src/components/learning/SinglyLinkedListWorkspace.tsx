import { useState, useEffect } from "react";
import {
  runExecution,
  checkPrediction,
  checkDebugging,
  submitQuiz,
  SllOperationType,
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
  Sparkles,
} from "lucide-react";

export function SinglyLinkedListWorkspace() {
  const [activeTab, setActiveTab] = useState<
    "concept" | "animation" | "try" | "predict" | "debug" | "quiz" | "ai" | "progress"
  >("animation");

  // Core List State
  const [currentList, setCurrentList] = useState<number[]>([14, 29, 42]);
  const [activeTrace, setActiveTrace] = useState<ExecutionTrace | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inputs for Try It Yourself
  const [inputValue, setInputValue] = useState<number>(7);
  const [inputPosition] = useState<number>(1);
  const [searchTarget, setSearchTarget] = useState<number>(29);

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
    op: SllOperationType,
    val?: number,
    pos?: number,
    overrideList?: number[],
  ) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const trace = await runExecution({
        topic: "singly_linked_list",
        operation: op,
        current_list: overrideList ?? currentList,
        value: val ?? inputValue,
        position: pos ?? inputPosition,
      });
      setActiveTrace(trace);
      if (trace.validation.valid) {
        setCurrentList(trace.final_state.nodes ?? []);
        setProgress((prev) => ({
          ...prev,
          operationsExplored: Math.max(prev.operationsExplored + 1, 4),
          interactiveAttempts: prev.interactiveAttempts + 1,
        }));
      }
    } catch (err: any) {
      console.error("Execution failed:", err);
      const detail =
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
    handleExecute(SllOperationType.DISPLAY, 0, 0, [14, 29, 42]);
  }, []);

  // Predict step check
  const handlePredictionSubmit = async (optionId: string) => {
    setSelectedPrediction(optionId);
    try {
      const res = await checkPrediction("pred_insert_front", optionId);
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
      const res = await checkDebugging("debug_cycle_broken", action);
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
      const res = await submitQuiz(quizAnswers);
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
            Module 01 · Data Structures
          </span>
          <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Singly Linked List
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Connected to Native C DSA Engine · Deterministic Trace Parser
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
              Singly Linked List Foundations
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              A <strong>Singly Linked List</strong> is a linear data structure where elements are not stored
              in contiguous memory locations. Instead, each node consists of two essential parts:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <h4 className="font-mono text-xs font-bold text-[var(--primary)] uppercase mb-1">
                  1. Data Field (Value)
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Stores the payload or element value (e.g., an integer, object, or character).
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <h4 className="font-mono text-xs font-bold text-[var(--accent)] uppercase mb-1">
                  2. Next Pointer (Address)
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Stores the memory address of the subsequent node in the chain, or points to <code>NULL</code> if it is the tail.
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
                  <span className="text-amber-500 font-bold">O(n)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] block">Search:</span>
                  <span className="text-amber-500 font-bold">O(n)</span>
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
            onRetry={() => handleExecute(SllOperationType.DISPLAY, 0, 0, currentList)}
          />

          {/* Quick Operation Triggers for Animation Stage */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <span className="text-xs font-mono font-semibold text-[var(--text-secondary)] uppercase block mb-3">
              Trigger C Engine Demonstrations
            </span>
            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleExecute(SllOperationType.INSERT_FRONT, 7)}
                disabled={loading}
              >
                Insert 7 at Front
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(SllOperationType.INSERT_BACK, 99)}
                disabled={loading}
              >
                Insert 99 at Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(SllOperationType.DELETE_FRONT)}
                disabled={loading}
              >
                Delete Front Node
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(SllOperationType.SEARCH, 29)}
                disabled={loading}
              >
                Search for 29
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExecute(SllOperationType.TRAVERSE)}
                disabled={loading}
              >
                Traverse All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(SllOperationType.REVERSE_ITERATIVE)}
                disabled={loading || currentList.length === 0}
              >
                Reverse Iterative
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute(SllOperationType.REVERSE_RECURSIVE)}
                disabled={loading || currentList.length === 0}
              >
                Reverse Recursive
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleExecute(SllOperationType.MERGE, 88)}
                disabled={loading}
              >
                Merge List (88)
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
            onRetry={() => handleExecute(SllOperationType.DISPLAY, 0, 0, currentList)}
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
                  onClick={() => handleExecute(SllOperationType.INSERT_FRONT, inputValue)}
                  disabled={loading}
                >
                  Front
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleExecute(SllOperationType.INSERT_BACK, inputValue)}
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
                Execute safe heap release on the compiled C engine.
              </p>
              <div className="flex gap-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleExecute(SllOperationType.DELETE_FRONT)}
                  disabled={loading || currentList.length === 0}
                >
                  Delete Front
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleExecute(SllOperationType.DELETE_BACK)}
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
                onClick={() => handleExecute(SllOperationType.SEARCH, searchTarget)}
                disabled={loading}
              >
                Search in List
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: PREDICT THE NEXT STEP */}
      {activeTab === "predict" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--secondary)]">
            <HelpCircle size={16} /> Active Recall Challenge
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Predict the Next Pointer Assignment
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Scenario: You allocate a new node <code>new_node</code> with value <code>7</code> and wish to
            insert it at the <strong>beginning</strong> of a non-empty linked list. What must happen FIRST
            before moving <code>head</code>?
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                id: "opt_set_next",
                title: "new_node->next = head;",
                subtitle: "Safely link the new node to the existing chain first.",
              },
              {
                id: "opt_update_head",
                title: "head = new_node;",
                subtitle: "Directly reassign head pointer to the new node.",
              },
              {
                id: "opt_free",
                title: "free(head);",
                subtitle: "Deallocate the head to make space.",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handlePredictionSubmit(opt.id)}
                className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                  selectedPrediction === opt.id
                    ? predictionFeedback?.correct
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 font-bold"
                    : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--primary)] text-[var(--text-primary)]"
                }`}
              >
                <div>
                  <span className="text-sm font-bold block mb-0.5">{opt.title}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{opt.subtitle}</span>
                </div>
                {selectedPrediction === opt.id && (
                  predictionFeedback?.correct ? <Check size={18} /> : <X size={18} />
                )}
              </button>
            ))}
          </div>

          {predictionFeedback && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed ${
                predictionFeedback.correct
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
              }`}
            >
              <strong>{predictionFeedback.correct ? "Correct! " : "Incorrect. "}</strong>
              {predictionFeedback.explanation}
            </div>
          )}
        </div>
      )}

      {/* STAGE 5: DEBUGGING CHALLENGE */}
      {activeTab === "debug" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500">
            <Bug size={16} /> Diagnostic Sandbox
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Fix the Infinite Cycle Bug
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The tail node of this list mistakenly references node <code>0x10</code> instead of pointing
            to <code>NULL</code>, creating an infinite loop during linear traversal.
          </p>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 font-mono text-xs text-amber-700 dark:text-amber-400 flex items-center justify-between">
            <span>{"node[0x30]->next == node[0x10] (CYCLE DETECTED)"}</span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDebugFix("disconnect_cycle")}
              disabled={debugResolved}
            >
              Sever Cycle: tail-&gt;next = NULL
            </Button>
          </div>

          {debugMessage && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                debugResolved
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
              }`}
            >
              {debugMessage}
            </div>
          )}
        </div>
      )}

      {/* STAGE 6: TOPIC QUIZ */}
      {activeTab === "quiz" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-500">
            <FileQuestion size={16} /> Comprehension Assessment
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Singly Linked List Quiz
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
              <span className="font-mono text-xs font-bold text-[var(--primary)]">Q1. What is the minimum time complexity to prepend an element at the beginning?</span>
              <div className="space-y-1.5 pt-1">
                {[
                  { id: "q2_opt_a", text: "O(1) - Constant time" },
                  { id: "q2_opt_b", text: "O(n) - Linear time" },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="q2"
                      value={opt.id}
                      onChange={() => setQuizAnswers((prev) => ({ ...prev, q2: opt.id }))}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
              <span className="font-mono text-xs font-bold text-[var(--primary)]">Q2. How is the end of a non-circular singly linked list identified?</span>
              <div className="space-y-1.5 pt-1">
                {[
                  { id: "q4_opt_a", text: "The next pointer loops back to head" },
                  { id: "q4_opt_b", text: "The next pointer is NULL" },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="q4"
                      value={opt.id}
                      onChange={() => setQuizAnswers((prev) => ({ ...prev, q4: opt.id }))}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Button variant="primary" size="sm" onClick={handleQuizSubmit}>
            Submit Assessment
          </Button>

          {quizResult && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              Score: {quizResult.score} / {quizResult.total} — {quizResult.passed ? "Passed!" : "Review foundations"}
            </div>
          )}
        </div>
      )}

      {/* STAGE 7: CONTEXTUAL AI TUTOR */}
      {activeTab === "ai" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--secondary)]">
            <Bot size={16} /> Socratic Mentor
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Contextual Trace Explanation
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            AI guidance explains the current C engine trace events without solving answers blindly.
          </p>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)] flex items-center gap-1.5">
              <Sparkles size={13} /> Active Observation
            </span>
            <p className="text-xs text-[var(--text-primary)] leading-relaxed">
              When inserting at front, notice that <code>{"new_node->next = head"}</code> captures the memory
              address of the old first node (<code>0x10</code>) before the <code>head</code> reference is
              reassigned. This preserves pointer continuity.
            </p>
          </div>
        </div>
      )}

      {/* STAGE 8: PROGRESS TRACKING */}
      {activeTab === "progress" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent)]">
            <TrendingUp size={16} /> Verified Mastery
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)]">
            Your Module Completion
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]">
              <span className="text-[11px] font-mono text-[var(--text-secondary)] block">Operations Run</span>
              <span className="text-lg font-mono font-bold text-[var(--primary)]">{progress.interactiveAttempts}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]">
              <span className="text-[11px] font-mono text-[var(--text-secondary)] block">Predictions Made</span>
              <span className="text-lg font-mono font-bold text-[var(--secondary)]">{progress.predictionsAnswered}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]">
              <span className="text-[11px] font-mono text-[var(--text-secondary)] block">Debugging Fixed</span>
              <span className="text-lg font-mono font-bold text-amber-500">{progress.debuggingCompleted}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
