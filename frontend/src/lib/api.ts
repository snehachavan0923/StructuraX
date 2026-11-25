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
    import.meta.env.VITE_API_BASE_URL ??
    "http://127.0.0.1:8000/api/v1",
  headers: {
    Accept: "application/json",
  },
  timeout: 5000,
});

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await apiClient.get<HealthResponse>("/health");
  return response.data;
}
