import { useParams, Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { SinglyLinkedListWorkspace } from "../components/learning/SinglyLinkedListWorkspace";
import { DoublyLinkedListWorkspace } from "../components/learning/DoublyLinkedListWorkspace";
import { CircularLinkedListWorkspace } from "../components/learning/CircularLinkedListWorkspace";
import { MemoryAllocationWorkspace } from "../components/learning/MemoryAllocationWorkspace";
import { PolynomialWorkspace } from "../components/learning/PolynomialWorkspace";
import { HeroVisualizer } from "../components/landing/hero/HeroVisualizer";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function LearningPlaceholder() {
  const { topicId } = useParams<{ topicId: string }>();

  const isSinglyLinkedList = topicId === "linked-lists" || topicId === "singly-linked-list";
  const isDoublyLinkedList = topicId === "doubly-linked-list" || topicId === "doubly-linked-lists";
  const isCircularLinkedList = topicId === "circular-linked-list" || topicId === "circular-lists";
  const isMemoryAllocation = topicId === "memory-allocation" || topicId === "static-dynamic-memory";
  const isPolynomial =
    topicId === "polynomial" ||
    topicId === "polynomial-arithmetic" ||
    topicId === "linked-list-applications";

  const formattedTitle = (topicId || "Data Structure")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <AppShell
      breadcrumbs={[
        { label: "Curriculum", href: "/curriculum" },
        { label: formattedTitle },
      ]}
    >
      {isSinglyLinkedList ? (
        <SinglyLinkedListWorkspace />
      ) : isDoublyLinkedList ? (
        <DoublyLinkedListWorkspace />
      ) : isCircularLinkedList ? (
        <CircularLinkedListWorkspace />
      ) : isMemoryAllocation ? (
        <MemoryAllocationWorkspace />
      ) : isPolynomial ? (
        <PolynomialWorkspace />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to="/curriculum"
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1"
                >
                  <ArrowLeft size={13} /> Back to Curriculum
                </Link>
              </div>
              <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                {formattedTitle} Module
              </h1>
              <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
                Topic Identifier: <span className="text-[var(--primary)]">{topicId}</span>
              </p>
            </div>
          </div>

          <HeroVisualizer />

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 mt-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] mb-2">
              <BookOpen size={16} className="text-[var(--primary)]" />
              <span>Upcoming Topic Module</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Unit I (Linked Lists, Memory Allocation, Doubly, Circular, Polynomial) is 100% complete and powered by the compiled C engine. This module will follow in subsequent curriculum phases.
            </p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
