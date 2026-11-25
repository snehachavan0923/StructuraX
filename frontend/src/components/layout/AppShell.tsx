import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Blocks,
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Layers,
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { ThemeSwitcher } from "../ui/theme-switcher";
import { usePrefersReducedMotion } from "../../hooks/use-reduced-motion";
import { fadeIn } from "../../lib/motion";

interface AppShellProps {
  children: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function AppShell({ children, breadcrumbs = [] }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  const navigationItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Curriculum", href: "/curriculum", icon: GraduationCap },
    { label: "Design System", href: "/design-system", icon: Sparkles },
    { label: "Visualizer Sandbox", href: "/learn/linked-lists", icon: Layers },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] cursor-pointer"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* StructuraX Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-sm transition-transform group-hover:scale-105">
              <Blocks size={17} />
            </span>
            <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-[var(--text-primary)]">
              Structura<span className="text-[var(--primary)]">X</span>
            </span>
          </Link>

          {/* Breadcrumbs for desktop */}
          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 ml-6 text-xs text-[var(--text-secondary)]">
              <Link to="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">
                App
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <ChevronRight size={12} className="opacity-60" />
                  {crumb.href ? (
                    <Link to={crumb.href} className="hover:text-[var(--text-primary)] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-[var(--text-primary)]">{crumb.label}</span>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Link
            to="/auth/signin"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
            title="Account"
          >
            <User size={15} />
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col justify-between border-r border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)] px-3 mb-2 block">
                Learning Workspace
              </span>
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-[var(--primary)] text-white shadow-sm"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)] px-3 mb-2 block">
                Modules Preview
              </span>
              <nav className="space-y-1 text-xs">
                {["Linked Lists", "Stacks", "Queues", "Binary Trees", "Graphs"].map((mod) => (
                  <Link
                    key={mod}
                    to={`/learn/${mod.toLowerCase().replace(" ", "-")}`}
                    className="flex items-center justify-between rounded-lg px-3 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  >
                    <span>{mod}</span>
                    <span className="text-[10px] font-mono opacity-50">Preview</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-4 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            >
              <LogOut size={15} />
              <span>Exit to Landing Page</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed inset-0 z-50 flex md:hidden"
            >
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                onClick={() => setSidebarOpen(false)}
              />

              <div className="relative w-64 max-w-[80vw] bg-[var(--surface)] p-4 flex flex-col justify-between border-r border-[var(--border)] shadow-2xl z-10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                    <span className="font-['Space_Grotesk'] text-sm font-bold">Navigation</span>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1 rounded text-[var(--text-secondary)]"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold ${
                            isActive
                              ? "bg-[var(--primary)] text-white"
                              : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                          }`}
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="border-t border-[var(--border)] pt-4">
                  <Link
                    to="/"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                  >
                    <LogOut size={15} />
                    <span>Exit to Landing Page</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area with page transition wrapper */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            variants={fadeIn}
            initial={reducedMotion ? false : "hidden"}
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
