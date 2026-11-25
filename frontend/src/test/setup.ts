import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

const listeners = new Set<(event: MediaQueryListEvent) => void>();
let prefersDark = false;

afterEach(() => {
  cleanup();
  listeners.clear();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: prefersDark,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) =>
      listeners.add(listener),
    removeEventListener: (
      _type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => listeners.delete(listener),
    dispatchEvent: vi.fn(),
  })),
});

export function setSystemColorScheme(theme: "light" | "dark") {
  prefersDark = theme === "dark";
  const event = { matches: prefersDark } as MediaQueryListEvent;
  listeners.forEach((listener) => listener(event));
}
