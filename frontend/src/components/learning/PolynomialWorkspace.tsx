import { useState, useEffect } from "react";
import {
  runExecution,
  PolyOperationType,
} from "../../lib/api";
import type { ExecutionTrace, PolyTermInput } from "../../lib/api";
import { TraceVisualizer } from "../../components/visualizer/TraceVisualizer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/form-controls";
import {
  BookOpen,
  Play,
  HelpCircle,
  Bug,
  FileQuestion,
  TrendingUp,
  Layers,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function PolynomialWorkspace() {
  const [activeTab, setActiveTab] = useState<
    "concept" | "polynomial" | "applications" | "predict" | "debug" | "quiz" | "progress"
  >("polynomial");

  // Polynomial State
  const [poly1Terms] = useState<PolyTermInput[]>([
    { coefficient: 4, exponent: 3 },
    { coefficient: 3, exponent: 2 },
    { coefficient: 5, exponent: 0 },
  ]);

  const [poly2Terms] = useState<PolyTermInput[]>([
    { coefficient: 2, exponent: 3 },
    { coefficient: -3, exponent: 2 },
    { coefficient: 7, exponent: 1 },
  ]);

  const [activeTrace, setActiveTrace] = useState<ExecutionTrace | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Applications Demo State
  const [appMode, setAppMode] = useState<"stack" | "queue">("stack");
  const [stackItems, setStackItems] = useState<number[]>([10, 20, 30]);
  const [queueItems, setQueueItems] = useState<number[]>([100, 200, 300]);
  const [appInputVal, setAppInputVal] = useState<number>(40);

  // Predict & Debug state
  const [predictionAnswer, setPredictionAnswer] = useState<string | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);

  const [debugChoice, setDebugChoice] = useState<string | null>(null);
  const [debugSolved, setDebugSolved] = useState<boolean>(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Progress metrics
  const [progress, setProgress] = useState({
    polyOperations: 1,
    appInteractions: 1,
    predictSolved: false,
    debugSolved: false,
    quizScore: 0,
  });

  // Execute C Engine Polynomial Operation
  const handleExecutePoly = async (
    op: PolyOperationType,
    customP1?: PolyTermInput[],
    customP2?: PolyTermInput[],
  ) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const trace = await runExecution({
        topic: "polynomial",
        operation: op,
        poly1_terms: customP1 ?? poly1Terms,
        poly2_terms: customP2 ?? poly2Terms,
      });
      setActiveTrace(trace);
      setProgress((p) => ({ ...p, polyOperations: p.polyOperations + 1 }));
    } catch (err: any) {
      console.error("Polynomial C engine execution failed:", err);
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to run polynomial arithmetic on native C engine.";
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleExecutePoly(PolyOperationType.ADD);
  }, []);

  // Stack/Queue LL Operations
  const handleStackPush = () => {
    setStackItems((prev) => [appInputVal, ...prev]);
    setProgress((p) => ({ ...p, appInteractions: p.appInteractions + 1 }));
  };

  const handleStackPop = () => {
    if (stackItems.length === 0) return;
    setStackItems((prev) => prev.slice(1));
    setProgress((p) => ({ ...p, appInteractions: p.appInteractions + 1 }));
  };

  const handleQueueEnqueue = () => {
    setQueueItems((prev) => [...prev, appInputVal]);
    setProgress((p) => ({ ...p, appInteractions: p.appInteractions + 1 }));
  };

  const handleQueueDequeue = () => {
    if (queueItems.length === 0) return;
    setQueueItems((prev) => prev.slice(1));
    setProgress((p) => ({ ...p, appInteractions: p.appInteractions + 1 }));
  };

  // Predict check
  const handlePredictSubmit = (choice: string) => {
    setPredictionAnswer(choice);
    if (choice === "b") {
      setPredictionFeedback({
        correct: true,
        explanation:
          "Correct! When adding terms with the same exponent (e.g. 3x^2 and -3x^2), the coefficients sum to 0. A well-designed polynomial linked list removes zero-coefficient terms to keep the representation canonical.",
      });
      setProgress((p) => ({ ...p, predictSolved: true }));
    } else {
      setPredictionFeedback({
        correct: false,
        explanation: "Incorrect. The exponent remains unchanged; coefficients are added algebraically.",
      });
    }
  };

  // Debug check
  const handleDebugSubmit = (choice: string) => {
    setDebugChoice(choice);
    if (choice === "fix_order") {
      setDebugSolved(true);
      setProgress((p) => ({ ...p, debugSolved: true }));
    } else {
      setDebugSolved(false);
    }
  };

  // Quiz check
  const handleQuizSubmit = () => {
    let score = 0;
    if (quizAnswers["q1"] === "descending") score++;
    if (quizAnswers["q2"] === "head") score++;
    if (quizAnswers["q3"] === "tail_head") score++;
    if (quizAnswers["q4"] === "sparse") score++;
    setQuizSubmitted(true);
    setProgress((p) => ({ ...p, quizScore: score }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--primary)] font-semibold">
              Unit I &bull; Topics 6 & 9
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)]">
              Real C Engine Verified
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Polynomial Arithmetic & Linked List Applications
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Perform algebraic operations on linked polynomials and explore real-world data structure adaptations.
          </p>
        </div>

        {/* C Engine Status Pill */}
        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 self-start sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            C Engine: <strong className="text-emerald-400">libstructurax_engine</strong>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-[var(--border)] pb-2 scrollbar-none">
        {[
          { id: "concept", label: "1. Concept & Theory", icon: BookOpen },
          { id: "polynomial", label: "2. Polynomial Arithmetic", icon: Play },
          { id: "applications", label: "3. Stack & Queue via LL", icon: Layers },
          { id: "predict", label: "4. Predict Step", icon: HelpCircle },
          { id: "debug", label: "5. Debug Traversal", icon: Bug },
          { id: "quiz", label: "6. Assessment Quiz", icon: FileQuestion },
          { id: "progress", label: "7. Progress", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[var(--primary)] text-white font-semibold shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CONCEPT */}
      {activeTab === "concept" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
                Polynomial Representation via Linked List
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                A polynomial P(x) = c_n * x^n + c_(n-1) * x^(n-1) + ... + c_0 is represented as a sequence of linked nodes where each node contains:
              </p>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 font-mono text-xs space-y-1">
                <p className="text-blue-400">struct PolyNode &#123;</p>
                <p className="pl-4 text-purple-400">int coeff;     // Term coefficient</p>
                <p className="pl-4 text-purple-400">int exp;       // Exponent power</p>
                <p className="pl-4 text-emerald-400">struct PolyNode* next;</p>
                <p className="text-blue-400">&#125;;</p>
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span><strong>Descending Order:</strong> Terms are strictly ordered by descending exponent.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span><strong>Zero Elimination:</strong> When coefficients cancel out to 0, nodes are pruned.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
                Applications of Linked Lists (Topic 6)
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Because linked lists support dynamic O(1) insertion and deletion at pointers without shifting array elements, they serve as the backbone for:
              </p>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]">
                  <strong className="text-[var(--text-primary)]">1. Stack Implementation (LIFO):</strong>
                  <p className="text-[var(--text-secondary)] mt-1">
                    Push = Insert at Head O(1); Pop = Delete at Head O(1).
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]">
                  <strong className="text-[var(--text-primary)]">2. Queue Implementation (FIFO):</strong>
                  <p className="text-[var(--text-secondary)] mt-1">
                    Enqueue = Insert at Tail O(1); Dequeue = Delete at Head O(1).
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]">
                  <strong className="text-[var(--text-primary)]">3. Sparse Matrices & Polynomials:</strong>
                  <p className="text-[var(--text-secondary)] mt-1">
                    Store only non-zero entries, preventing massive memory waste in large scientific domains.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POLYNOMIAL ARITHMETIC */}
      {activeTab === "polynomial" && (
        <div className="space-y-6">
          {/* Operations Bar */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <span className="text-xs font-mono font-semibold text-[var(--text-secondary)] mr-2">
              Arithmetic Operations:
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => handleExecutePoly(PolyOperationType.ADD)}
            >
              <Plus size={14} className="mr-1" /> Add (P1 + P2)
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => handleExecutePoly(PolyOperationType.SUBTRACT)}
            >
              <Minus size={14} className="mr-1" /> Subtract (P1 - P2)
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => handleExecutePoly(PolyOperationType.MULTIPLY)}
            >
              <Sparkles size={14} className="mr-1" /> Multiply (P1 &times; P2)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={loading}
              onClick={() => handleExecutePoly(PolyOperationType.DISPLAY)}
              className="ml-auto"
            >
              Display Result
            </Button>
          </div>

          {/* Polynomial Input Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* P1 */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400">
                  Polynomial P1(x)
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {poly1Terms.map((t, i) => `${t.coefficient > 0 && i > 0 ? "+" : ""}${t.coefficient}x^${t.exponent}`).join(" ")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {poly1Terms.map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border)] font-mono text-xs"
                  >
                    {t.coefficient}x^{t.exponent}
                  </span>
                ))}
              </div>
            </div>

            {/* P2 */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-400">
                  Polynomial P2(x)
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {poly2Terms.map((t, i) => `${t.coefficient > 0 && i > 0 ? "+" : ""}${t.coefficient}x^${t.exponent}`).join(" ")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {poly2Terms.map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border)] font-mono text-xs"
                  >
                    {t.coefficient}x^{t.exponent}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Visualizer */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 shadow-sm min-h-[460px] flex flex-col justify-between">
            <TraceVisualizer
              trace={activeTrace}
              isLoading={loading}
              error={errorMessage}
              mode="polynomial"
            />
          </div>
        </div>
      )}

      {/* TAB 3: APPLICATIONS (STACK & QUEUE VIA LL) */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] w-fit">
            <button
              onClick={() => setAppMode("stack")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                appMode === "stack"
                  ? "bg-[var(--primary)] text-white font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Stack via Linked List (LIFO)
            </button>
            <button
              onClick={() => setAppMode("queue")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                appMode === "queue"
                  ? "bg-[var(--primary)] text-white font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Queue via Linked List (FIFO)
            </button>
          </div>

          {/* Interactive Stack/Queue Canvas */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-[var(--text-secondary)]">Value:</span>
              <Input
                type="number"
                value={appInputVal}
                onChange={(e) => setAppInputVal(Number(e.target.value))}
                className="w-20 text-xs h-8"
              />
              {appMode === "stack" ? (
                <>
                  <Button size="sm" onClick={handleStackPush}>
                    Push (Insert at Head O(1))
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleStackPop}>
                    Pop (Delete at Head O(1))
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={handleQueueEnqueue}>
                    Enqueue (Insert at Tail O(1))
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleQueueDequeue}>
                    Dequeue (Delete at Head O(1))
                  </Button>
                </>
              )}
            </div>

            {/* Visual Display */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 min-h-[160px] flex items-center justify-center">
              {appMode === "stack" ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-mono text-purple-400 font-bold">&darr; TOP OF STACK (HEAD)</span>
                  {stackItems.length === 0 ? (
                    <span className="text-xs text-[var(--text-secondary)]">Stack is Empty (NULL)</span>
                  ) : (
                    <div className="flex flex-col gap-2 w-48">
                      {stackItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-center font-mono text-xs font-bold text-[var(--text-primary)] shadow-sm"
                        >
                          Node [{item}] {idx === 0 ? "(Top / Head)" : ""}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto p-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">FRONT &rarr;</span>
                    {queueItems.length === 0 ? (
                      <span className="text-xs text-[var(--text-secondary)]">Queue is Empty (NULL)</span>
                    ) : (
                      queueItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="px-4 py-2.5 rounded-lg border border-[var(--primary)]/30 bg-[var(--surface)] text-center font-mono text-xs font-bold text-[var(--text-primary)]">
                            [{item}]
                          </div>
                          {idx < queueItems.length - 1 && <span className="text-xs text-[var(--primary)]">&rarr;</span>}
                        </div>
                      ))
                    )}
                    <span className="text-xs font-mono text-purple-400 font-bold">&larr; REAR</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PREDICT */}
      {activeTab === "predict" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-[var(--primary)]" />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
              Prediction: Like Term Cancellation
            </h3>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Suppose P1 has node <code className="text-blue-400">+3x^2</code> and P2 has node <code className="text-purple-400">-3x^2</code>.
            What is the resulting term when calculating P1 + P2?
          </p>

          <div className="space-y-3">
            {[
              { id: "a", text: "A node with coefficient 0 and exponent 2 remains in the resulting list." },
              { id: "b", text: "The term is completely eliminated from the resulting list (zero terms are omitted)." },
              { id: "c", text: "The exponent becomes 0 while the coefficient stays 3." },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handlePredictSubmit(opt.id)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                  predictionAnswer === opt.id
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 font-medium text-[var(--text-primary)]"
                    : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--primary)]/50 text-[var(--text-secondary)]"
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {predictionFeedback && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                predictionFeedback.correct
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {predictionFeedback.correct ? (
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              ) : (
                <XCircle size={18} className="shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold mb-1">{predictionFeedback.correct ? "Spot on!" : "Not quite."}</p>
                <p>{predictionFeedback.explanation}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: DEBUG */}
      {activeTab === "debug" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Bug size={18} className="text-amber-400" />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
              Debugging: Term Ordering Invariant
            </h3>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            A student implemented polynomial addition, but the result displayed terms in random order: 5 + 4x^3 - 2x.
            Why is descending exponent ordering critical for efficient addition?
          </p>

          <div className="space-y-3">
            {[
              {
                id: "fix_order",
                text: "Descending order allows a single-pass merge in O(n + m) time, similar to merge sort.",
              },
              {
                id: "fix_space",
                text: "Ascending order requires less memory than descending order.",
              },
              {
                id: "fix_cffi",
                text: "The C language compiler cannot allocate memory if exponents are unordered.",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleDebugSubmit(opt.id)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                  debugChoice === opt.id
                    ? "border-emerald-500 bg-emerald-500/10 font-medium text-[var(--text-primary)]"
                    : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--primary)]/50 text-[var(--text-secondary)]"
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {debugChoice && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                debugSolved
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {debugSolved ? (
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              ) : (
                <XCircle size={18} className="shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold mb-1">{debugSolved ? "Invariant Verified!" : "Incorrect."}</p>
                <p>
                  Maintaining strictly descending exponents enables linear time O(n+m) parallel traversal. Unsorted lists would necessitate nested loops O(n * m) to locate matching exponents.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: QUIZ */}
      {activeTab === "quiz" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2">
              <FileQuestion size={18} className="text-[var(--primary)]" />
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
                Polynomial & Applications Assessment
              </h3>
            </div>
            {quizSubmitted && (
              <span className="text-xs font-mono font-bold text-[var(--primary)]">
                Score: {progress.quizScore} / 4
              </span>
            )}
          </div>

          {/* Q1 */}
          <div className="space-y-2 text-xs">
            <p className="font-semibold text-[var(--text-primary)]">
              1. In what order must polynomial terms be linked to ensure linear-time addition?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "descending", label: "Descending order of exponent" },
                { id: "ascending", label: "Ascending order of coefficient" },
                { id: "random", label: "Any insertion order" },
                { id: "alphabetical", label: "Lexicographical order" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setQuizAnswers((p) => ({ ...p, q1: c.id }))}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quizAnswers["q1"] === c.id
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div className="space-y-2 text-xs">
            <p className="font-semibold text-[var(--text-primary)]">
              2. In a linked list Stack implementation, where should push and pop take place for O(1) time?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "head", label: "At the Head (insert_beg, delete_beg)" },
                { id: "tail", label: "At the Tail without a tail pointer" },
                { id: "middle", label: "At the middle index" },
                { id: "binary", label: "At alternating ends" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setQuizAnswers((p) => ({ ...p, q2: c.id }))}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quizAnswers["q2"] === c.id
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q3 */}
          <div className="space-y-2 text-xs">
            <p className="font-semibold text-[var(--text-primary)]">
              3. In a linked list Queue implementation, enqueue is performed at _____ and dequeue at _____:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "tail_head", label: "Enqueue at Tail, Dequeue at Head" },
                { id: "head_tail", label: "Enqueue at Head, Dequeue at Tail" },
                { id: "both_head", label: "Both at Head" },
                { id: "both_tail", label: "Both at Tail" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setQuizAnswers((p) => ({ ...p, q3: c.id }))}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quizAnswers["q3"] === c.id
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q4 */}
          <div className="space-y-2 text-xs">
            <p className="font-semibold text-[var(--text-primary)]">
              4. A matrix in which the majority of elements are zero is known as:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "sparse", label: "A Sparse Matrix" },
                { id: "dense", label: "A Dense Matrix" },
                { id: "identity", label: "An Identity Matrix" },
                { id: "scalar", label: "A Scalar Matrix" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setQuizAnswers((p) => ({ ...p, q4: c.id }))}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quizAnswers["q4"] === c.id
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleQuizSubmit} className="w-full">
            Submit Assessment
          </Button>
        </div>
      )}

      {/* TAB 7: PROGRESS */}
      {activeTab === "progress" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[var(--primary)]" />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
              Polynomial & Applications Mastery
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-center">
              <span className="text-[10px] uppercase font-mono text-[var(--text-secondary)]">Polynomial Runs</span>
              <p className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--text-primary)] mt-1">
                {progress.polyOperations}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-center">
              <span className="text-[10px] uppercase font-mono text-[var(--text-secondary)]">App Interactions</span>
              <p className="font-['Space_Grotesk'] text-2xl font-bold text-purple-400 mt-1">
                {progress.appInteractions}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-center">
              <span className="text-[10px] uppercase font-mono text-[var(--text-secondary)]">Quiz Score</span>
              <p className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--primary)] mt-1">
                {progress.quizScore} / 4
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
