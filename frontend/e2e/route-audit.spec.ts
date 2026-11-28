import { expect, test } from "@playwright/test";
import { CURRICULUM_TOPICS } from "../src/data/navigation";

const topics = CURRICULUM_TOPICS.flatMap((g) => g.children);

test.describe("Sidebar route audit", () => {
  for (const topic of topics) {
    test(`route ${topic.path} resolves`, async ({ page }) => {
      await page.goto(topic.path);
      await expect(page.locator("body")).toBeVisible();
      const sidebar = page.getByRole("complementary");
      const active = sidebar.locator('a[class*="text-[var(--primary)]"]');
      await expect(active).toHaveCount(1);
      await expect(active).toHaveAttribute("href", topic.path);
    });
  }

  test("refresh and back/forward update selection", async ({ page }) => {
    await page.goto("/learn/singly-linked-list");
    await page.reload();
    let active = page.getByRole("complementary").locator('a[class*="text-[var(--primary)]"]');
    await expect(active).toHaveAttribute("href", "/learn/singly-linked-list");

    await page.goto("/learn/doubly-linked-list");
    await page.goBack();
    active = page.getByRole("complementary").locator('a[class*="text-[var(--primary)]"]');
    await expect(active).toHaveAttribute("href", "/learn/singly-linked-list");

    await page.goForward();
    active = page.getByRole("complementary").locator('a[class*="text-[var(--primary)]"]');
    await expect(active).toHaveAttribute("href", "/learn/doubly-linked-list");
  });
});
