import { ArrowLeft, Blocks, Network } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ThemeSwitcher } from "../components/ui/theme-switcher";

function Shell({ title, description, breadcrumb }: { title: string; description: string; breadcrumb: string }) {
  return (
    <div className="app-placeholder">
      <aside className="app-placeholder__sidebar">
        <Link className="landing-brand" to="/" aria-label="StructuraX home"><span className="landing-brand__mark"><Network size={19} /></span><span>StructuraX</span></Link>
        <nav aria-label="Application navigation">
          <Link to="/dashboard" className="app-placeholder__nav-item"><Blocks size={17} /> Dashboard</Link>
          <Link to="/curriculum" className="app-placeholder__nav-item"><Blocks size={17} /> Curriculum</Link>
        </nav>
      </aside>
      <main className="app-placeholder__main">
        <header className="app-placeholder__top"><nav aria-label="Breadcrumb"><span>StructuraX</span><b>/</b><span>{breadcrumb}</span></nav><ThemeSwitcher /></header>
        <section className="app-placeholder__state"><span className="app-placeholder__icon"><Blocks size={24} /></span><p className="section-kicker">Coming in a future phase</p><h1>{title}</h1><p>{description}</p><Link className="hero-primary" to="/"><ArrowLeft size={16} /> Back to home</Link></section>
      </main>
    </div>
  );
}

export function DashboardPlaceholder() { return <Shell title="Learning dashboard" description="Your personalized learning workspace will live here." breadcrumb="Dashboard" />; }
export function CurriculumPlaceholder() { return <Shell title="Curriculum" description="Explore the complete DSA learning path in a future phase." breadcrumb="Curriculum" />; }
export function LearningPlaceholder() {
  const { topicId } = useParams();
  return <Shell title={`${topicId?.replaceAll("-", " ") || "Topic"} learning space`} description="Interactive lessons and visual operations will appear here." breadcrumb="Learning" />;
}
export function AuthPlaceholder() { return <Shell title="Authentication" description="Sign-in and account creation will be available in a later phase." breadcrumb="Authentication" />; }
