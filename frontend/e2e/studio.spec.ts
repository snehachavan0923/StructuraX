import { expect, test } from "@playwright/test";

test.describe("Phase 1B immersive studio", () => {
  test("stage navigation stays synchronized with workspace tabs", async ({ page }) => {
    await page.goto("/learn/singly-linked-list");
    await page.getByRole("button", { name: "1. Concept" }).click();
    await expect(page.getByText("Singly Linked List Foundations")).toBeVisible();
    await expect(page.getByRole("tab", { name: /Concept/ })).toHaveAttribute("aria-selected", "true");

    await page.getByRole("tab", { name: /Try It Yourself/ }).click();
    await expect(page.getByRole("button", { name: "1. Concept" })).not.toHaveClass(/bg-\[var\(--primary\)\]/);
  });

  test("playback controls and inspector share trace state", async ({ page }) => {
    await page.goto("/learn/singly-linked-list");
    await expect(page.getByText(/C Engine Trace: DISPLAY/)).toBeVisible();
    await page.getByTitle("Step forward").click();
    await expect(page.getByText(/Step 2 of/)).toBeVisible();
    await expect(page.getByText("Execution Insight")).toBeVisible();
    await expect(page.getByText(/STEP 2/)).toBeVisible();
  });

  test("inspector can be toggled", async ({ page }) => {
    await page.goto("/learn/memory-allocation");
    await expect(page.getByText("Execution Insight")).toBeVisible();
    await page.getByLabel("Hide contextual panel").click();
    await expect(page.getByText("Execution Insight")).not.toBeVisible();
    await page.getByLabel("Show contextual panel").click();
    await expect(page.getByText("Execution Insight")).toBeVisible();
  });

  test("studio is responsive without horizontal overflow", async ({ page }) => {
    await page.goto("/learn/singly-linked-list");
    for (const width of [1440, 1024, 768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `overflow at ${width}`).toBe(false);
    }
  });

  test("studio theme persists across reload", async ({ page }) => {
    await page.goto("/learn/memory-allocation");
    await page.getByRole("combobox", { name: "Color theme" }).first().selectOption("dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
