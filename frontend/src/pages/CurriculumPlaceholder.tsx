import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { GraduationCap, ArrowRight, Layers, Binary, Network, Share2, Database, ListOrdered } from "lucide-react";
import { Button } from "../components/ui/button";

const SYLLABUS_MODULES = [
  {
    id: "linked-lists",
    title: "Linked Lists",
    topics: ["Singly Linked List", "Doubly Linked List", "Circular Lists", "Floyd's Cycle Detection"],
    icon: ListOrdered,
  },
  {
    id: "stacks",
    title: "Stacks & Queues",
    topics: ["Array & List Stack", "Queue with Two Stacks", "Monotonic Stack", "Circular Queue"],
    icon: Layers,
  },
  {
    id: "trees",
    title: "Trees & Binary Search Trees",
    topics: ["Binary Tree Traversals", "BST Invariants", "AVL Self-Balancing", "Segment Trees"],
    icon: Binary,
  },
  {
    id: "heaps",
    title: "Heaps & Priority Queues",
    topics: ["Min/Max Heapify", "Priority Queue Implementation", "K-Way Merging"],
    icon: Network,
  },
  {
    id: "graphs",
    title: "Graphs & Networks",
    topics: ["Breadth-First Search", "Depth-First Search", "Dijkstra's Algorithm", "Topological Sort"],
    icon: Share2,
  },
  {
    id: "hashing",
    title: "Hashing & Tables",
    topics: ["Hash Functions", "Chaining", "Linear Probing", "Collision Resolution"],
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
              Browse the complete progression of data structures and algorithms. Each topic links to interactive
              visualizations and prediction challenges.
            </p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SYLLABUS_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between hover:border-[var(--primary)]/50 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--primary)]">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
                      {mod.title}
                    </h3>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {mod.topics.map((t) => (
                      <li key={t} className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={`/learn/${mod.id}`}>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>Enter Module Preview</span>
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
