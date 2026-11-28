import axios from "axios";

export interface ComponentHealth {
  status: string;
  detail?: string;
  version?: string;
}

export interface HealthResponse {
  status: string;
  api: string;
  database: ComponentHealth;
  engine: ComponentHealth;
  checked_at: string;
}

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? "/api/v1" : "http://127.0.0.1:8011/api/v1"),
  headers: {
    Accept: "application/json",
  },
  timeout: 8000,
});

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await apiClient.get<HealthResponse>("/health");
  return response.data;
}

export interface TraceEvent {
  step: number;
  event_type: string;
  node_id: string | null;
  payload: Record<string, unknown>;
  pointers: Record<string, unknown>;
  counters: Record<string, number>;
}

export interface ExecutionTrace {
  schema_version: "1.0.0";
  operation_id: string;
  operation: string;
  initial_state: {
    size: number;
    nodes?: number[];
    head?: string | null;
    tail?: string | null;
    is_circular?: boolean;
    terms?: { coeff: number; exp: number }[];
    expression?: string;
  };
  final_state: {
    size: number;
    nodes?: number[];
    head?: string | null;
    tail?: string | null;
    is_circular?: boolean;
    terms?: { coeff: number; exp: number }[];
    expression?: string;
  };
  events: TraceEvent[];
  validation: {
    valid: boolean;
    message: string;
  };
  counters: {
    visits: number;
    allocations: number;
    steps: number;
  };
}

export const SllOperationType = {
  CREATE: 0,
  INSERT_FRONT: 1,
  INSERT_BACK: 2,
  INSERT_AT: 3,
  DELETE_FRONT: 4,
  DELETE_BACK: 5,
  DELETE_AT: 6,
  SEARCH: 7,
  TRAVERSE: 8,
  DISPLAY: 9,
  REVERSE_ITERATIVE: 10,
  REVERSE_RECURSIVE: 11,
  MERGE: 12,
} as const;
export type SllOperationType = (typeof SllOperationType)[keyof typeof SllOperationType];

export const DllOperationType = {
  CREATE: 0,
  INSERT_FRONT: 1,
  INSERT_BACK: 2,
  INSERT_AT: 3,
  INSERT_BEFORE: 4,
  INSERT_AFTER: 5,
  DELETE_FRONT: 6,
  DELETE_BACK: 7,
  DELETE_AT: 8,
  DELETE_VALUE: 9,
  TRAVERSE_FORWARD: 10,
  TRAVERSE_BACKWARD: 11,
  SEARCH: 12,
  DISPLAY: 13,
  REVERSE: 14,
  MERGE: 15,
} as const;
export type DllOperationType = (typeof DllOperationType)[keyof typeof DllOperationType];

export const CllOperationType = {
  CREATE: 0,
  INSERT_FRONT: 1,
  INSERT_BACK: 2,
  INSERT_AT: 3,
  DELETE_FRONT: 4,
  DELETE_BACK: 5,
  DELETE_AT: 6,
  SEARCH: 7,
  TRAVERSE: 8,
  DISPLAY: 9,
  REVERSE: 10,
  MERGE: 11,
} as const;
export type CllOperationType = (typeof CllOperationType)[keyof typeof CllOperationType];

export interface PolyTermInput {
  coefficient: number;
  exponent: number;
}

export const PolyOperationType = {
  CREATE: 0,
  DISPLAY: 1,
  ADD: 2,
  SUBTRACT: 3,
  MULTIPLY: 4,
} as const;
export type PolyOperationType = (typeof PolyOperationType)[keyof typeof PolyOperationType];

export interface ExecutionRunParams {
  topic?: string;
  operation: number;
  current_list?: number[];
  value?: number;
  position?: number;
  target_value?: number;
  coeffs1?: number[];
  exps1?: number[];
  coeffs2?: number[];
  exps2?: number[];
  poly1_terms?: PolyTermInput[];
  poly2_terms?: PolyTermInput[];
}

export async function runExecution(params: ExecutionRunParams): Promise<ExecutionTrace> {
  const coeffs1 = params.coeffs1 ?? params.poly1_terms?.map((t) => t.coefficient) ?? [];
  const exps1 = params.exps1 ?? params.poly1_terms?.map((t) => t.exponent) ?? [];
  const coeffs2 = params.coeffs2 ?? params.poly2_terms?.map((t) => t.coefficient) ?? [];
  const exps2 = params.exps2 ?? params.poly2_terms?.map((t) => t.exponent) ?? [];

  const response = await apiClient.post<ExecutionTrace>("/execution/run", {
    topic: params.topic ?? "singly_linked_list",
    operation: params.operation,
    current_list: params.current_list ?? [],
    value: params.value ?? 0,
    position: params.position ?? 0,
    target_value: params.target_value ?? 0,
    coeffs1,
    exps1,
    coeffs2,
    exps2,
  });
  return response.data;
}

export async function checkPrediction(
  scenarioId: string,
  optionId: string,
  topic: string = "singly_linked_list"
): Promise<{
  is_correct: boolean;
  explanation: string;
  expected_event_type: string;
}> {
  const response = await apiClient.post("/execution/predict/check", {
    topic,
    scenario_id: scenarioId,
    selected_option_id: optionId,
  });
  return response.data;
}

export async function checkDebugging(
  challengeId: string,
  action: string,
  topic: string = "singly_linked_list"
): Promise<{
  resolved: boolean;
  message: string;
  fixed_state: number[];
}> {
  const response = await apiClient.post("/execution/debug/check", {
    topic,
    challenge_id: challengeId,
    action,
  });
  return response.data;
}

export async function submitQuiz(
  answers: Record<string, string>,
  topic: string = "singly_linked_list"
): Promise<{
  score: number;
  total: number;
  passed: boolean;
  results: Record<string, boolean>;
  explanations: Record<string, string>;
}> {
  const response = await apiClient.post("/execution/quiz/submit", {
    topic,
    answers,
  });
  return response.data;
}
