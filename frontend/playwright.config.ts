import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

const backendDirectory = resolve(process.cwd(), "../backend");

export default defineConfig({
  testDir: "./e2e",
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:5174",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command:
        ".venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8011",
      cwd: backendDirectory,
      url: "http://127.0.0.1:8011/api/v1/health",
      env: {
        CORS_ORIGINS:
          "http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174",
      },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: "npm run dev -- --host 127.0.0.1 --port 5174 --strictPort",
      url: "http://127.0.0.1:5174",
      env: {
        VITE_API_BASE_URL: "http://127.0.0.1:8011/api/v1",
      },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
