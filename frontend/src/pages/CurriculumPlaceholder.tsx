import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import {
  GraduationCap,
  ArrowRight,
  Layers,
  Binary,
  Network,
  Share2,
  Database,
  ListOrdered,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";

const SYLLABUS_MODULES = [
  {
    id: "linked-lists",
    title: "Memory Allocation & Linked Lists",
    status: "Live — C Engine Powered",
    subtopics: [
      { name: "Static & Dynamic Memory", path: "/learn/memory-allocation" },
      { name: "Singly Linked List (13 Ops)", path: "/learn/singly-linked-list" },
      { name: "Doubly Linked List (16 Ops)", path: "/learn/doubly-linked-list" },
      { name: "Circular Linked List (12 Ops)", path: "/learn/circular-linked-list" },
      { name: "Polynomial & Applications", path: "/learn/polynomial" },
    ],
    icon: ListOrdered,
  },
  {
    id: "stacks",
    title: "Stacks & Queues",
    status: "Upcoming",
    subtopics: [
      { name: "Array & List Stack", path: "/learn/stacks" },
      { name: "Queue with Two Stacks", path: "/learn/stacks" },
      { name: "Monotonic Stack", path: "/learn/stacks" },
      { name: "Circular Queue", path: "/learn/stacks" },
    ],
    icon: Layers,
  },
  {
    id: "trees",
    title: "Trees & Binary Search Trees",
    status: "Upcoming",
    subtopics: [
      { name: "Binary Tree Traversals", path: "/learn/trees" },
      { name: "BST Invariants", path: "/learn/trees" },
      { name: "AVL Self-Balancing", path: "/learn/trees" },
      { name: "Segment Trees", path: "/learn/trees" },
    ],
    icon: Binary,
  },
  {
    id: "heaps",
    title: "Heaps & Priority Queues",
    status: "Upcoming",
    subtopics: [
      { name: "Min/Max Heapify", path: "/learn/heaps" },
      { name: "Priority Queue Implementation", path: "/learn/heaps" },
      { name: "K-Way Merging", path: "/learn/heaps" },
    ],
    icon: Network,
  },
  {
    id: "graphs",
    title: "Graphs & Networks",
    status: "Upcoming",
    subtopics: [
      { name: "Breadth-First Search", path: "/learn/graphs" },
      { name: "Depth-First Search", path: "/learn/graphs" },
      { name: "Dijkstra's Algorithm", path: "/learn/graphs" },
      { name: "Topological Sort", path: "/learn/graphs" },
    ],
    icon: Share2,
  },
  {
    id: "hashing",
    title: "Hashing & Tables",
    status: "Upcoming",
    subtopics: [
      { name: "Hash Functions", path: "/learn/hashing" },
      { name: "Chaining", path: "/learn/hashing" },
      { name: "Linear Probing", path: "/learn/hashing" },
      { name: "Collision Resolution", path: "/learn/hashing" },
    ],
    icon: Database,
  },
];

export default function CurriculumPlaceholder() {
  return (
    <AppShell breadcrumbs={[{ label: "Curriculum" }]}>
      <div className="space-y-8">
        {/* Banner */}
        <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--surface-elevated)] to-[var(--surface)] p-6 md:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)] mb-3">
              <GraduationCap size={14} />
              <span>Syllabus Map</span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
              StructuraX Curriculum
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Browse the complete progression of data structures and algorithms. Unit I is fully operational with native C engine execution and real-time step visualization.
            </p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SYLLABUS_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isCompleted = mod.id === "linked-lists";
            return (
              <div
                key={mod.id}
                className={`rounded-2xl border bg-[var(--surface)] p-6 flex flex-col justify-between transition-all shadow-sm ${
                  isCompleted
                    ? "border-[var(--primary)]/60 shadow-[0_0_20px_rgba(255,107,0,0.08)]"
                    : "border-[var(--border)] hover:border-[var(--primary)]/40"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--primary)]">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-['Space_Grotesk'] text-base font-bold text-[var(--text-primary)] leading-tight">
                          {mod.title}
                        </h3>
                        <span
                          className={`text-[10px] font-mono font-medium ${
                            isCompleted ? "text-emerald-400" : "text-[var(--text-secondary)]"
                          }`}
                        >
                          {mod.status}
                        </span>
                      </div>
                    </div>
                    {isCompleted && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-semibold">
                        <CheckCircle2 size={12} />
                        Active
                      </span>
                    )}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {mod.subtopics.map((t) => (
                      <li key={t.name} className="text-xs">
                        <Link
                          to={t.path}
                          className="flex items-center justify-between text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors py-1 group"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isCompleted ? "bg-[var(--primary)]" : "bg-[var(--text-secondary)]"
                              }`}
                            />
                            <span>{t.name}</span>
                          </div>
                          <ArrowRight
                            size={12}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--primary)]"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={mod.subtopics[0].path}>
                  <Button
                    variant={isCompleted ? "primary" : "outline"}
                    size="sm"
                    className="w-full justify-between"
                  >
                    <span>{isCompleted ? "Explore Unit I Topics" : "Preview Module"}</span>
                    <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
