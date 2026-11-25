import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DesignSystemPage from "./pages/DesignSystemPage";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import CurriculumPlaceholder from "./pages/CurriculumPlaceholder";
import LearningPlaceholder from "./pages/LearningPlaceholder";
import AuthPlaceholder from "./pages/AuthPlaceholder";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Phase 2 Design System Preview Showcase */}
        <Route path="/design-system" element={<DesignSystemPage />} />

        {/* Future Authenticated Application Shell & Learning Placeholders */}
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
        <Route path="/curriculum" element={<CurriculumPlaceholder />} />
        <Route path="/learn/:topicId" element={<LearningPlaceholder />} />

        {/* Authentication Placeholders */}
        <Route path="/auth/signin" element={<AuthPlaceholder />} />
        <Route path="/auth/signup" element={<AuthPlaceholder />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
