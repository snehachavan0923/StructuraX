import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResolvedTheme, ThemePreference } from "../types/theme";

type ThemeState = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export function resolveTheme(
  preference: ThemePreference,
  systemPreference: ResolvedTheme,
): ResolvedTheme {
  return preference === "system" ? systemPreference : preference;
}

function getSystemPreference(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(preference: ThemePreference): void {
  const resolved = resolveTheme(preference, getSystemPreference());
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: "system",
      setPreference: (preference) => {
        applyTheme(preference);
        set({ preference });
      },
    }),
    {
      name: "structurax-theme",
      partialize: ({ preference }) => ({ preference }),
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.preference);
      },
    },
  ),
);
