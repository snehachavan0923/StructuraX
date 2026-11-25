import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Blocks,
  Braces,
  Check,
  Code2,
  Layers3,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "../lib/api";
import {
  fadeIn,
  hoverInteraction,
  motionDuration,
  staggerChildren,
} from "../lib/motion";
import { usePrefersReducedMotion } from "../hooks/use-reduced-motion";
import { Breadcrumb, NavigationGroup, SidebarItem, TopNavigation } from "../components/layout/navigation";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Badge,
  EmptyState,
  ErrorState,
  Progress,
  Skeleton,
  Toast,
  Tooltip,
} from "../components/ui/feedback";
import { Checkbox, Input, Radio, Select, Switch, Textarea } from "../components/ui/form-controls";
import { ThemeSwitcher } from "../components/ui/theme-switcher";
import {
  ConnectionArrow,
  ExecutionProgress,
  ExecutionStep,
  IndexLabel,
  PlaybackControls,
  PointerLabel,
  StatusIndicator,
  VisualizerNode,
  VisualizerWorkspace,
} from "../components/visualizer/primitives";

const tokens = [
  { label: "Primary", value: "var(--primary)" },
  { label: "Secondary", value: "var(--secondary)" },
  { label: "Accent", value: "var(--accent)" },
  { label: "Surface", value: "var(--surface-elevated)" },
];

export default function DesignSystemPage() {
  const [toastVisible, setToastVisible] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    retry: false,
  });

  const animationTransition = reducedMotion
    ? { duration: 0 }
    : { duration: motionDuration.standard };

  return (
    <main className="showcase">
      <TopNavigation
        brand={
          <>
            <Link to="/" className="brand-mark" aria-label="StructuraX Home">
              <Blocks size={18} />
            </Link>
            <span className="brand-name">
              Structura<span>X / design foundations</span>
            </span>
          </>
        }
        actions={
          <>
            <Link to="/">
              <Button variant="ghost" size="sm" leadingIcon={<ArrowLeft size={14} />}>
                Back to Home
              </Button>
            </Link>
            <Badge tone="success">
              <Check size={12} aria-hidden="true" />
              System ready
            </Badge>
            <ThemeSwitcher />
          </>
        }
      />

      <motion.section
        className="hero"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        transition={animationTransition}
      >
        <motion.div className="hero__copy" variants={fadeIn}>
          <div className="hero__eyebrow eyebrow">
            <Sparkles size={14} aria-hidden="true" />
            Phase 02 · Visual language
          </div>
          <h1>
            A clearer way to <span>think in systems.</span>
          </h1>
          <p className="hero__description">
            A calm, precise foundation for learning how data structures work.
            Designed for focus, built to make every state feel understandable.
          </p>
        </motion.div>
        <motion.aside className="hero__aside" variants={fadeIn}>
          <div className="hero__aside-top">
            <span className="eyebrow">Design system</span>
            <StatusIndicator status="complete" label="Foundations" />
          </div>
          <p>
            Preview reusable themes, interaction states and visualizer
            primitives. This is a component sandbox, not a product dashboard.
          </p>
          <Breadcrumb
            items={[
              { label: "Foundations", href: "#tokens" },
              { label: "Preview" },
            ]}
          />
        </motion.aside>
      </motion.section>

      <section className="showcase-section" id="tokens" aria-labelledby="tokens-title">
        <div className="section-heading">
          <div>
            <span className="section-index">01 / Foundations</span>
            <h2 id="tokens-title">Color & type</h2>
          </div>
          <p>Theme-aware tokens keep every interface coherent and legible.</p>
        </div>
        <div className="showcase-grid">
          <Card className="span-7">
            <CardHeader>
              <CardTitle>Color roles</CardTitle>
              <CardDescription>
                Semantic roles adapt to the selected light, dark or system theme.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="palette">
                {tokens.map((token) => (
                  <div
                    className="swatch"
                    key={token.label}
                    style={{ "--swatch": token.value } as React.CSSProperties}
                  >
                    <span>{token.label}</span>
                  </div>
                ))}
              </div>
              <div className="button-row" style={{ marginTop: "1rem" }}>
                <Badge tone="success">Success</Badge>
                <Badge tone="warning">Warning</Badge>
                <Badge tone="error">Error</Badge>
                <Badge tone="information">Information</Badge>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated" className="span-5">
            <CardHeader>
              <CardTitle>Type scale</CardTitle>
              <CardDescription>
                Space Grotesk · Inter · JetBrains Mono
              </CardDescription>
            </CardHeader>
            <CardContent className="type-samples">
              <p className="type-samples__display">Learn by seeing.</p>
              <p className="type-samples__body">
                Body copy stays comfortable, clear and easy to scan.
              </p>
              <p className="type-samples__mono">head → node[02] → tail</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="showcase-section" aria-labelledby="components-title">
        <div className="section-heading">
          <div>
            <span className="section-index">02 / Components</span>
            <h2 id="components-title">Interaction essentials</h2>
          </div>
          <p>Small, accessible building blocks for future learning surfaces.</p>
        </div>
        <div className="showcase-grid">
          <Card className="span-6">
            <CardHeader>
              <CardTitle>Buttons & states</CardTitle>
              <CardDescription>
                Clear hierarchy, loading, disabled and icon-only controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="button-row">
              <Button leadingIcon={<Sparkles size={15} />}>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button loading>Working</Button>
              <Button disabled>Disabled</Button>
              <Tooltip content="Icon controls always need an accessible name">
                <Button variant="outline" size="icon" aria-label="View details">
                  <ArrowUpRight size={16} />
                </Button>
              </Tooltip>
            </CardContent>
          </Card>

          <Card variant="interactive" className="span-6">
            <CardHeader>
              <CardTitle>Card treatments</CardTitle>
              <CardDescription>
                Standard, elevated, interactive and information surfaces.
              </CardDescription>
            </CardHeader>
            <CardContent className="button-row">
              <Badge>Standard</Badge>
              <Badge tone="information">Elevated</Badge>
              <Badge tone="success">Interactive hover</Badge>
              <Badge tone="warning">Information</Badge>
            </CardContent>
          </Card>

          <Card className="span-7">
            <CardHeader>
              <CardTitle>Form controls</CardTitle>
              <CardDescription>
                Native semantic inputs styled with shared focus and error tokens.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="form-demo">
                <label className="field-group">
                  <span>Search structures</span>
                  <Input placeholder="e.g. linked list" aria-label="Search structures" />
                </label>
                <label className="field-group">
                  <span>Difficulty</span>
                  <Select aria-label="Difficulty" defaultValue="beginner">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Select>
                </label>
                <label className="field-group form-demo__wide">
                  <span>Notes</span>
                  <Textarea
                    aria-label="Notes"
                    placeholder="Write a short observation…"
                    rows={2}
                  />
                </label>
                <div className="inline-controls form-demo__wide">
                  <label>
                    <Checkbox defaultChecked aria-label="Save progress" />
                    Save progress
                  </label>
                  <label>
                    <Radio name="density" value="comfortable" defaultChecked />
                    Comfortable
                  </label>
                  <Switch label="Show hints" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="span-5">
            <CardHeader>
              <CardTitle>Feedback & progress</CardTitle>
              <CardDescription>
                Helpful status without interrupting the learner.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: "grid", gap: "1rem" }}>
              <Progress value={68} label="Module progress" />
              {toastVisible ? (
                <Toast
                  tone="success"
                  title="Progress saved"
                  onDismiss={() => setToastVisible(false)}
                >
                  Your latest changes are up to date.
                </Toast>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setToastVisible(false)}
                >
                  Show notification
                </Button>
              )}
              <div className="skeleton-stack" aria-label="Loading preview">
                <Skeleton className="skeleton--title" />
                <Skeleton className="skeleton--line" />
                <Skeleton />
              </div>
            </CardContent>
          </Card>

          <Card className="span-6">
            <CardHeader>
              <CardTitle>Empty & error states</CardTitle>
              <CardDescription>
                Clear, actionable feedback for unavailable content.
              </CardDescription>
            </CardHeader>
            <CardContent className="showcase-grid">
              <div className="span-6">
                <EmptyState
                  title="Nothing here yet"
                  description="Your saved examples will appear here."
                />
              </div>
              <div className="span-6">
                <ErrorState
                  title="Could not load"
                  description="Try again when your connection is restored."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="span-6">
            <CardHeader>
              <CardTitle>Navigation foundations</CardTitle>
              <CardDescription>
                Primitives only; no full product sidebar or page navigation.
              </CardDescription>
            </CardHeader>
            <CardContent className="navigation-demo">
              <NavigationGroup label="Workspace">
                <SidebarItem href="#tokens" icon={<Layers3 size={16} />} active>
                  Foundations
                </SidebarItem>
                <SidebarItem href="#visualizer" icon={<Code2 size={16} />}>
                  Visualizer primitives
                </SidebarItem>
              </NavigationGroup>
              <Breadcrumb
                items={[
                  { label: "Learning", href: "#components-title" },
                  { label: "Foundations", href: "#tokens" },
                  { label: "Components" },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        className="showcase-section"
        id="visualizer"
        aria-labelledby="visualizer-title"
      >
        <div className="section-heading">
          <div>
            <span className="section-index">03 / Visualizer language</span>
            <h2 id="visualizer-title">Ready for structured execution</h2>
          </div>
          <p>
            SVG-friendly primitives only. Future states must be driven by C
            engine events.
          </p>
        </div>
        <div className="showcase-grid">
          <Card className="span-8">
            <CardHeader>
              <CardTitle>Linked structure workspace</CardTitle>
              <CardDescription>
                Reusable node, pointer, index and connection representations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VisualizerWorkspace title="Node sequence">
                <div className="visualizer-workspace__canvas">
                  <div style={{ position: "relative" }}>
                    <PointerLabel>head</PointerLabel>
                    <VisualizerNode value="12" label="node 01" selected />
                  </div>
                  <ConnectionArrow />
                  <VisualizerNode value="24" label="node 02" />
                  <ConnectionArrow />
                  <VisualizerNode value="38" label="node 03" />
                </div>
              </VisualizerWorkspace>
              <div className="button-row" style={{ marginTop: "1rem" }}>
                <IndexLabel>01</IndexLabel>
                <ExecutionStep
                  current={2}
                  total={5}
                  description="Visiting the next node"
                />
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated" className="span-4">
            <CardHeader>
              <CardTitle>Execution controls</CardTitle>
              <CardDescription>Control and status foundations.</CardDescription>
            </CardHeader>
            <CardContent style={{ display: "grid", gap: "1rem" }}>
              <PlaybackControls />
              <ExecutionProgress value={42} />
              <StatusIndicator status="running" label="Execution ready" />
              <StatusIndicator status="idle" label="Paused" />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="showcase-section" aria-labelledby="motion-title">
        <div className="section-heading">
          <div>
            <span className="section-index">04 / Motion</span>
            <h2 id="motion-title">Meaningful, reduced-aware motion</h2>
          </div>
          <p>
            Motion respects the operating-system reduced-motion preference.
          </p>
        </div>
        <div className="showcase-grid">
          <Card className="span-4">
            <CardHeader>
              <CardTitle>Interaction</CardTitle>
              <CardDescription>Subtle lift on hover and press.</CardDescription>
            </CardHeader>
            <CardContent className="motion-demo">
              <motion.div
                className="motion-demo__tile"
                {...(reducedMotion ? {} : hoverInteraction)}
                whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                aria-hidden="true"
              >
                <Sparkles size={20} />
              </motion.div>
            </CardContent>
          </Card>
          <Card className="span-4">
            <CardHeader>
              <CardTitle>Entrance</CardTitle>
              <CardDescription>Short fade, no layout choreography.</CardDescription>
            </CardHeader>
            <CardContent className="motion-demo">
              <motion.div
                className="motion-demo__tile"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={animationTransition}
                aria-hidden="true"
              >
                <Activity size={20} />
              </motion.div>
            </CardContent>
          </Card>
          <Card className="span-4">
            <CardHeader>
              <CardTitle>Reduced motion</CardTitle>
              <CardDescription>System preference is respected.</CardDescription>
            </CardHeader>
            <CardContent className="motion-demo">
              <Badge tone={reducedMotion ? "warning" : "success"}>
                {reducedMotion ? "Reduced motion active" : "Standard motion"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="showcase-section" aria-labelledby="health-title">
        <div className="section-heading">
          <div>
            <span className="section-index">05 / Integration check</span>
            <h2 id="health-title">Live service status</h2>
          </div>
          <p>
            The original API health call remains live; errors are shown without
            a fabricated fallback.
          </p>
        </div>
        <div className="showcase-grid">
          <Card className="span-8">
            <CardHeader>
              <CardTitle>Backend health response</CardTitle>
              <CardDescription>
                Real response from the existing FastAPI health endpoint.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {healthQuery.isPending && (
                <p role="status">Checking the live backend…</p>
              )}
              {healthQuery.isError && (
                <ErrorState
                  title="Backend request failed"
                  description={healthQuery.error.message}
                />
              )}
              {healthQuery.data && (
                <pre
                  className="health-response"
                  data-testid="health-response"
                >
                  {JSON.stringify(healthQuery.data, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
          <Card variant="information" className="span-4">
            <CardHeader>
              <CardTitle>Built to extend</CardTitle>
              <CardDescription>
                Product modules can reuse these foundations as they arrive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge tone="information">
                <Braces size={12} aria-hidden="true" />
                No fake execution states
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="showcase-footer">
        <span>StructuraX · Design foundations preview</span>
        <a href="#tokens">Back to foundations ↑</a>
      </footer>
    </main>
  );
}
