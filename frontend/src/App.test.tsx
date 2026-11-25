import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./lib/api", () => ({
  fetchHealth: vi.fn(() => new Promise(() => {})),
}));

describe("design system preview", () => {
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

  it("preserves the live health request in the design showcase", () => {
    expect(
      screen.getByRole("heading", { name: "A clearer way to think in systems." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Checking the live backend…")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Color theme" })).toHaveValue(
      "system",
    );
  });
});
