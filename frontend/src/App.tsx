import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./pages/LandingPage";

const DesignSystemPage = lazy(() => import("./pages/DesignSystemPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPlaceholder"));
const CurriculumPage = lazy(() => import("./pages/CurriculumPlaceholder"));
const LearningPage = lazy(() => import("./pages/LearningPlaceholder"));
const AuthPage = lazy(() => import("./pages/AuthPlaceholder"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/curriculum" element={<CurriculumPage />} />
            <Route path="/learn/:topicId" element={<LearningPage />} />
            <Route path="/auth/signin" element={<AuthPage />} />
            <Route path="/auth/signup" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
