import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Network, Layers, Binary, GitFork, Database, ListOrdered, Share2 } from "lucide-react";
import { fadeIn, staggerChildren } from "../../../lib/motion";

interface CurriculumCategory {
  id: string;
  name: string;
  tagline: string;
  operations: string[];
  complexity: string;
  icon: typeof Network;
  accentColor: string;
  visualPreview: "list" | "stack" | "queue" | "tree" | "heap" | "graph" | "hash";
}

const CATEGORIES: CurriculumCategory[] = [
  {
    id: "linked-lists",
    name: "Linked Lists",
    tagline: "Singly, Doubly & Circular Chains",
    operations: ["Insertion", "Reversal", "Cycle Detection", "Fast/Slow Pointers"],
    complexity: "O(1) insert · O(n) search",
    icon: ListOrdered,
    accentColor: "var(--primary)",
    visualPreview: "list",
  },
  {
    id: "stacks",
    name: "Stacks",
    tagline: "LIFO Execution & Expressions",
    operations: ["Push / Pop", "Monotonic Stack", "Balanced Parentheses", "RPN Evaluator"],
    complexity: "O(1) push · O(1) pop",
    icon: Layers,
    accentColor: "var(--accent)",
    visualPreview: "stack",
  },
  {
    id: "queues",
    name: "Queues & Deques",
    tagline: "FIFO Buffers & Sliding Windows",
    operations: ["Enqueue / Dequeue", "Circular Buffer", "Sliding Window Maximum"],
    complexity: "O(1) amortized",
    icon: Binary,
    accentColor: "var(--secondary)",
    visualPreview: "queue",
  },
  {
    id: "trees",
    name: "Binary Trees & BST",
    tagline: "Hierarchical Traversal & Balancing",
    operations: ["In/Pre/Post Order", "AVL Rotations", "LCA", "Diameter"],
    complexity: "O(log n) balanced",
    icon: GitFork,
    accentColor: "#38bdf8",
    visualPreview: "tree",
  },
  {
    id: "heaps",
    name: "Heaps & Priority Queues",
    tagline: "Min/Max Binary Heaps",
    operations: ["Heapify", "Extract Min/Max", "Top-K Elements", "Median Stream"],
    complexity: "O(log n) insert · O(1) peek",
    icon: Network,
    accentColor: "#f59e0b",
    visualPreview: "heap",
  },
  {
    id: "graphs",
    name: "Graphs & Networks",
    tagline: "Topological Sort & Shortest Paths",
    operations: ["BFS / DFS", "Dijkstra", "Kruskal / Prim", "Tarjan SCC"],
    complexity: "O(V + E) traversal",
    icon: Share2,
    accentColor: "#a855f7",
    visualPreview: "graph",
  },
  {
    id: "hashing",
    name: "Hash Tables",
    tagline: "Collision Resolution & Buckets",
    operations: ["Separate Chaining", "Open Addressing", "Robin Hood Hashing"],
    complexity: "O(1) average lookup",
    icon: Database,
    accentColor: "#10b981",
    visualPreview: "hash",
  },
];

export function CurriculumPreviewSection() {
  return (
    <section id="curriculum" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--primary)] font-semibold">
              Comprehensive Curriculum
            </span>
            <h2 className="mt-2 font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Core Data Structures & Algorithms
            </h2>
            <p className="mt-3 text-base text-[var(--text-secondary)]">
              A meticulously sequenced curriculum. Each topic features step-by-step visualizations,
              debugging sandboxes, and verification quizzes.
            </p>
          </div>
          <Link
            to="/curriculum"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline whitespace-nowrap"
          >
            <span>View Full Curriculum Index</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                variants={fadeIn}
                className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] group-hover:border-[var(--primary)]/40 transition-colors"
                      style={{ color: cat.accentColor }}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-xs text-[var(--text-secondary)]">
                      {cat.complexity}
                    </span>
                  </div>

                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)] mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-mono text-[var(--text-secondary)] mb-4">
                    {cat.tagline}
                  </p>

                  {/* Operations preview tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {cat.operations.map((op) => (
                      <span
                        key={op}
                        className="rounded bg-[var(--surface-elevated)] px-2 py-0.5 text-[11px] font-mono text-[var(--text-secondary)] border border-[var(--border)]"
                      >
                        {op}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/learn/${cat.id}`}
                  className="inline-flex items-center justify-between pt-4 border-t border-[var(--border)] text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors"
                >
                  <span>Explore Module</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
