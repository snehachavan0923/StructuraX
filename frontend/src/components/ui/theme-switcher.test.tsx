import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeSwitcher } from "./theme-switcher";
import { setSystemColorScheme } from "../../test/setup";
import { useThemeStore } from "../../stores/theme-store";

describe("theme preference", () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ preference: "system" });
    document.documentElement.dataset.theme = "light";
    setSystemColorScheme("light");
  });

  it("switches immediately and persists the explicit preference", () => {
    render(<ThemeSwitcher />);
    fireEvent.change(screen.getByRole("combobox", { name: "Color theme" }), {
      target: { value: "dark" },
    });

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(JSON.parse(localStorage.getItem("structurax-theme") ?? "{}")).toMatchObject({
      state: { preference: "dark" },
    });
  });

  it("tracks operating-system changes while system mode is selected", () => {
    render(<ThemeSwitcher />);

    setSystemColorScheme("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    setSystemColorScheme("light");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("does not override an explicit preference when the system changes", () => {
    render(<ThemeSwitcher />);
    fireEvent.change(screen.getByRole("combobox", { name: "Color theme" }), {
      target: { value: "dark" },
    });

    setSystemColorScheme("light");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});
