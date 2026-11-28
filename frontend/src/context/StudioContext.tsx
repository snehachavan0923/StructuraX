import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ExecutionTrace } from "../lib/api";

export const STUDIO_STAGES = [
  { id: "concept", label: "Concept", short: "01" },
  { id: "animation", label: "Watch Animation", short: "02" },
  { id: "try", label: "Try It Yourself", short: "03" },
  { id: "predict", label: "Predict Step", short: "04" },
  { id: "debug", label: "Debugging", short: "05" },
  { id: "quiz", label: "Topic Quiz", short: "06" },
  { id: "ai", label: "AI Tutor", short: "07" },
  { id: "progress", label: "Progress", short: "08" },
] as const;

export type StudioStage = (typeof STUDIO_STAGES)[number]["id"];

export interface StudioTraceState {
  trace: ExecutionTrace | null;
  stepIndex: number;
  isPlaying: boolean;
  speed: number;
}

interface StudioContextValue {
  activeStage: StudioStage;
  setActiveStage: (stage: StudioStage) => void;
  inspectorOpen: boolean;
  setInspectorOpen: (open: boolean) => void;
  traceState: StudioTraceState;
  setTraceState: (state: StudioTraceState) => void;
  topicTitle: string;
  topicId: string;
}

const StudioContext = createContext<StudioContextValue | null>(null);

interface StudioProviderProps {
  children: ReactNode;
  topicTitle: string;
  topicId: string;
  initialStage?: StudioStage;
}

export function StudioProvider({
  children,
  topicTitle,
  topicId,
  initialStage = "animation",
}: StudioProviderProps) {
  const [activeStage, setActiveStage] = useState<StudioStage>(initialStage);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [traceState, setTraceState] = useState<StudioTraceState>({
    trace: null,
    stepIndex: 0,
    isPlaying: false,
    speed: 1,
  });

  const value = useMemo(
    () => ({
      activeStage,
      setActiveStage,
      inspectorOpen,
      setInspectorOpen,
      traceState,
      setTraceState,
      topicTitle,
      topicId,
    }),
    [activeStage, inspectorOpen, traceState, topicTitle, topicId],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) throw new Error("useStudio must be used inside StudioProvider");
  return context;
}
