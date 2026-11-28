import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Blocks, ChevronDown, ChevronRight, Menu, X, User } from "lucide-react";
import { ThemeSwitcher } from "../ui/theme-switcher";
import { usePrefersReducedMotion } from "../../hooks/use-reduced-motion";
import { fadeIn } from "../../lib/motion";
import { APP_NAVIGATION, CURRICULUM_TOPICS } from "../../data/navigation";
import type { TopicStatus } from "../../data/navigation";

const statusColor: Record<TopicStatus, string> = {
  live: "text-[var(--success)] bg-[var(--success-soft)]",
  beta: "text-[var(--warning)] bg-[var(--warning-soft)]",
  planned: "text-[var(--text-secondary)] bg-[var(--surface-elevated)]",
};

interface AppShellProps {
  children: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function AppShell({ children, breadcrumbs = [] }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "linked-lists": true, memory: true });
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      CURRICULUM_TOPICS.forEach((topic) => {
        if (topic.children.some((child) => child.path === location.pathname)) {
          next[topic.id] = true;
        }
      });
      return next;
    });
  }, [location.pathname]);

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-sm">
            <Blocks size={17} />
          </span>
          <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight">
            Structura<span className="text-[var(--primary)]">X</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {APP_NAVIGATION.map((group) => (
          <div key={group.label} className="mb-4">
            <span className="mb-2 block px-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
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
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mb-4">
          <span className="mb-2 block px-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Curriculum
          </span>
          <div className="space-y-1">
            {CURRICULUM_TOPICS.map((topic) => {
              const Icon = topic.icon;
              const isOpen = expanded[topic.id];
              return (
                <div key={topic.id}>
                  <button
                    onClick={() => toggle(topic.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  >
                    <Icon size={15} />
                    <span className="flex-1 text-left">{topic.label}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono ${statusColor[topic.status]}`}>
                      {topic.status}
                    </span>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4"
                      >
                        <div className="space-y-0.5 py-1">
                          {topic.children.map((child) => {
                            const active = location.pathname === child.path;
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
                                <span className={`h-1.5 w-1.5 rounded-full ${child.status === "live" ? "bg-[var(--success)]" : "bg-[var(--text-secondary)]"}`} />
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
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
        >
          <X size={15} />
          <span>Exit to Landing Page</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--sidebar)] md:flex">
        {SidebarContent}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex md:hidden"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="relative z-10 w-72 max-w-[85vw] border-r border-[var(--border)] bg-[var(--sidebar)] shadow-2xl"
            >
              <div className="flex justify-end p-2">
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-[var(--text-secondary)]" aria-label="Close sidebar">
                  <X size={18} />
                </button>
              </div>
              {SidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--sidebar)]/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            {breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <Link to="/dashboard" className="hover:text-[var(--text-primary)]">App</Link>
                {breadcrumbs.map((crumb, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <ChevronRight size={12} className="opacity-60" />
                    {crumb.href ? (
                      <Link to={crumb.href} className="hover:text-[var(--text-primary)]">{crumb.label}</Link>
                    ) : (
                      <span className="font-medium text-[var(--text-primary)]">{crumb.label}</span>
                    )}
                  </div>
                ))}
              </nav>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Link
              to="/auth/signin"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--primary)]"
              title="Account"
            >
              <User size={15} />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <motion.div
            key={location.pathname}
            variants={fadeIn}
            initial={reducedMotion ? false : "hidden"}
            animate="visible"
            className="mx-auto max-w-7xl"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
