import { useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Blocks,
  ChevronDown,
  ChevronRight,
  Menu,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";
import { ThemeSwitcher } from "../ui/theme-switcher";
import { usePrefersReducedMotion } from "../../hooks/use-reduced-motion";
import { APP_NAVIGATION, CURRICULUM_TOPICS } from "../../data/navigation";
import type { TopicStatus } from "../../data/navigation";
import { STUDIO_STAGES, useStudio } from "../../context/StudioContext";
import type { StudioStage } from "../../context/StudioContext";
import { StudioInspector } from "./StudioInspector";

const statusColor: Record<TopicStatus, string> = {
  live: "text-[var(--success)] bg-[var(--success-soft)]",
  beta: "text-[var(--warning)] bg-[var(--warning-soft)]",
  planned: "text-[var(--text-secondary)] bg-[var(--surface-elevated)]",
};

interface StudioShellProps {
  children: ReactNode;
}

export function StudioShell({ children }: StudioShellProps) {
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const { activeStage, setActiveStage, inspectorOpen, setInspectorOpen, topicTitle, topicId } =
    useStudio();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CURRICULUM_TOPICS.forEach((topic) => {
      initial[topic.id] = topic.children.some((child) => child.path === location.pathname);
    });
    return initial;
  });

  const toggleTopic = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const topicRail = (
    <div className="studio-rail flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-[var(--border)] px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-sm">
            <Blocks size={17} />
          </span>
          <span className="font-['Space_Grotesk'] text-base font-bold tracking-tight">
            Structura<span className="text-[var(--primary)]">X</span>
          </span>
          <span className="ml-1 rounded border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--primary)]">
            Studio
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Workspace navigation">
        {APP_NAVIGATION.map((group) => (
          <div key={group.label} className="mb-5">
            <span className="mb-2 block px-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              {group.label}
            </span>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? "bg-[var(--primary)] text-white shadow-sm"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div>
          <span className="mb-2 block px-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Curriculum
          </span>
          <div className="space-y-1">
            {CURRICULUM_TOPICS.map((topic) => {
              const Icon = topic.icon;
              const open = expanded[topic.id] ?? false;
              const hasActive = topic.children.some((child) => child.path === location.pathname);
              return (
                <div key={topic.id}>
                  <button
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    aria-expanded={open}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                      hasActive
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Icon size={15} />
                    <span className="flex-1 text-left">{topic.label}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[9px] ${statusColor[topic.status]}`}
                    >
                      {topic.status}
                    </span>
                    {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden pl-4"
                      >
                        <div className="space-y-0.5 py-1">
                          {topic.children.map((child) => {
                            const active = child.path === location.pathname;
                            return (
                              <Link
                                key={child.id}
                                to={child.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center justify-between rounded-md px-3 py-1.5 text-xs transition-colors ${
                                  active
                                    ? "bg-[var(--surface-elevated)] text-[var(--primary)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                }`}
                              >
                                <span>{child.label}</span>
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    child.status === "live"
                                      ? "bg-[var(--success)]"
                                      : "bg-[var(--text-secondary)]"
                                  }`}
                                />
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
        >
          <X size={15} />
          <span>Exit to Landing Page</span>
        </Link>
      </div>
    </div>
  );

  const setStage = (stage: StudioStage) => {
    setActiveStage(stage);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("studio:stage", { detail: stage }));
    }
  };

  return (
    <div className="studio-shell flex h-screen min-h-0 overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--sidebar)] md:block">
        {topicRail}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={reducedMotion ? false : { x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 h-full w-72 max-w-[85vw] border-r border-[var(--border)] bg-[var(--sidebar)] shadow-2xl"
            >
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-4 z-20 rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              >
                <X size={18} />
              </button>
              {topicRail}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="studio-topbar flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--sidebar)]/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] md:hidden"
            >
              <Menu size={18} />
            </button>
            <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-xs text-[var(--text-secondary)] sm:flex">
              <Link to="/dashboard" className="hover:text-[var(--text-primary)]">
                App
              </Link>
              <ChevronRight size={12} className="opacity-60" />
              <Link to="/curriculum" className="hover:text-[var(--text-primary)]">
                Curriculum
              </Link>
              <ChevronRight size={12} className="opacity-60" />
            </nav>
            <div className="min-w-0">
              <span className="block truncate font-['Space_Grotesk'] text-sm font-bold text-[var(--text-primary)]">
                {topicTitle}
              </span>
              <span className="block truncate font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
                Immersive Studio · {topicId}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeSwitcher />
            <button
              type="button"
              aria-label={inspectorOpen ? "Hide contextual panel" : "Show contextual panel"}
              onClick={() => setInspectorOpen(!inspectorOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              {inspectorOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            </button>
          </div>
        </header>

        <div className="studio-stagebar shrink-0 border-b border-[var(--border)] bg-[var(--surface)]/60 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Learning journey">
            {STUDIO_STAGES.map((stage) => {
              const active = stage.id === activeStage;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStage(stage.id)}
                  className={`group flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? "border-[var(--primary)]/50 bg-[var(--primary)]/15 text-[var(--primary)]"
                      : "border-transparent text-[var(--text-secondary)] hover:border-[var(--border)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-70">{stage.short}</span>
                  <span className="whitespace-nowrap">{stage.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <main className="studio-main min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <motion.div
              key={location.pathname}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="studio-canvas mx-auto w-full max-w-[1600px] space-y-6"
            >
              {children}
            </motion.div>
          </main>

          <AnimatePresence initial={false}>
            {inspectorOpen && (
              <motion.div
                initial={reducedMotion ? false : { width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="hidden shrink-0 overflow-hidden border-l border-[var(--border)] bg-[var(--surface)] lg:block"
              >
                <StudioInspector />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
