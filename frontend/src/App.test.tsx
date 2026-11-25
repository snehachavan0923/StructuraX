import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./lib/api", () => ({
  fetchHealth: vi.fn(() => new Promise(() => {})),
}));

describe("StructuraX Landing Page & Application Shell", () => {
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

  it("renders the primary headline on the landing page", () => {
    expect(
      screen.getByRole("heading", { name: /Understand DSA\.\s+Don't Just Memorize It\./i }),
    ).toBeInTheDocument();
  });

  it("renders primary and secondary call to action buttons", () => {
    const startButtons = screen.getAllByRole("button", { name: /Start Learning/i });
    expect(startButtons.length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Explore Visualizations/i })).toBeInTheDocument();
  });

  it("renders navigation items including theme switcher", () => {
    const themeComboboxes = screen.getAllByRole("combobox", { name: "Color theme" });
    expect(themeComboboxes.length).toBeGreaterThan(0);
    expect(themeComboboxes[0]).toHaveValue("system");
    expect(screen.getByText("Explore DSA")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("How It Works")).toBeInTheDocument();
  });

  it("renders the animated visualizer preview with live controls", () => {
    expect(screen.getByText("Live Preview Simulation")).toBeInTheDocument();
    expect(screen.getByText("Pause")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
    expect(screen.getByText("+ Insert")).toBeInTheDocument();
  });
});
