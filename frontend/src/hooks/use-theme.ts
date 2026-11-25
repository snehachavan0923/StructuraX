import { useEffect } from "react";
import { useThemeStore } from "../stores/theme-store";

export function useTheme() {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = (event: MediaQueryListEvent) => {
      if (useThemeStore.getState().preference === "system") {
        document.documentElement.dataset.theme = event.matches ? "dark" : "light";
        document.documentElement.style.colorScheme = event.matches
          ? "dark"
          : "light";
      }
    };

    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, []);

  return { preference, setPreference };
}
