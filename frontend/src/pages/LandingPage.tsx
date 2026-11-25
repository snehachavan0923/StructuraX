import { LandingNavbar } from "../components/landing/navbar/LandingNavbar";
import { HeroSection } from "../components/landing/hero/HeroSection";
import { TrustValueSection } from "../components/landing/features/TrustValueSection";
import { FeatureSection } from "../components/landing/features/FeatureSection";
import { HowItWorksSection } from "../components/landing/how-it-works/HowItWorksSection";
import { CurriculumPreviewSection } from "../components/landing/curriculum-preview/CurriculumPreviewSection";
import { AiTutorPreviewSection } from "../components/landing/ai-tutor-preview/AiTutorPreviewSection";
import { FinalCtaSection, LandingFooter } from "../components/landing/footer/FooterSections";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--background)] text-[var(--text-primary)] selection:bg-[var(--primary)] selection:text-white">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustValueSection />
        <FeatureSection />
        <HowItWorksSection />
        <CurriculumPreviewSection />
        <AiTutorPreviewSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
