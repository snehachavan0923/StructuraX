import { expect, test } from "@playwright/test";

test.describe("Phase 1A navigation and dashboard", () => {
  test("dashboard renders and sidebar navigates", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Learning Dashboard" })).toBeVisible();

    const sidebar = page.getByRole("complementary");
    await sidebar.getByRole("link", { name: "Curriculum" }).click();
    await expect(page.getByRole("heading", { name: "StructuraX Curriculum" })).toBeVisible();

    await sidebar.getByRole("link", { name: "Dashboard" }).click();
    await expect(page.getByRole("heading", { name: "Learning Dashboard" })).toBeVisible();

    await sidebar.getByRole("link", { name: "Design System" }).click();
    await expect(page.getByRole("heading", { name: "A clearer way to think in systems." })).toBeVisible();
  });

  test("sidebar topic groups expand and collapse", async ({ page }) => {
    await page.goto("/dashboard");
    const sidebar = page.getByRole("complementary");

    // Stacks is collapsed by default
    await expect(sidebar.getByText("Array Stack")).not.toBeVisible();
    await sidebar.getByRole("button", { name: /Stacks/ }).click();
    await expect(sidebar.getByText("Array Stack")).toBeVisible();
    await sidebar.getByRole("button", { name: /Stacks/ }).click();
    await expect(sidebar.getByText("Array Stack")).not.toBeVisible();
  });

  test("mobile sidebar opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");
    await expect(page.getByLabel("Toggle sidebar")).toBeVisible();
    await page.getByLabel("Toggle sidebar").click();
    const sidebar = page.getByRole("complementary");
    await expect(sidebar.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await page.getByRole("button", { name: "Toggle sidebar" }).or(page.getByLabel("Toggle sidebar")).first();
    await page.getByLabel("Close sidebar").click();
    await expect(sidebar).not.toBeVisible();
  });

  
  test("theme persists after reload on dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("combobox", { name: "Color theme" }).first().selectOption("dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.getByRole("combobox", { name: "Color theme" }).first()).toHaveValue("dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("no horizontal overflow at key breakpoints", async ({ page }) => {
    await page.goto("/dashboard");
    for (const width of [1440, 1024, 768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `overflow at ${width}`).toBe(false);
    }
  });
});
