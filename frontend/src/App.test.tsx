import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./lib/api", () => ({
  fetchHealth: vi.fn(() => new Promise(() => {})),
}));

describe("temporary health check", () => {
  beforeEach(() => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
  });

  it("shows a pending state while the backend request is in flight", () => {
    expect(
      screen.getByRole("heading", { name: "Temporary API health check" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Checking the live backend…")).toBeInTheDocument();
  });
});
