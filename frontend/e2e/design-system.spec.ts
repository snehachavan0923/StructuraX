import { expect, test } from "@playwright/test";

test("theme preferences persist on landing page and system mode works", async ({
  page,
}) => {
  await page.goto("/");

  const theme = page.getByRole("combobox", { name: "Color theme" }).first();
  await theme.selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.getByRole("combobox", { name: "Color theme" }).first()).toHaveValue(
    "dark",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("combobox", { name: "Color theme" }).first().selectOption("system");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("landing page renders headline, visualizer, sections, and navigates to design-system", async ({
  page,
}) => {
  await page.goto("/");

  // Check Headline
  await expect(
    page.getByRole("heading", { name: /Understand DSA\.\s*Don't Just Memorize It\./i }),
  ).toBeVisible();

  // Check Interactive hero visualizer
  await expect(page.getByText("Live Preview Simulation")).toBeVisible();
  await expect(page.getByText("visualizer::singly_linked_list::traverse()")).toBeVisible();

  // Check 5 Pillars of Visual Mastery
  await expect(page.getByText("The 5 Pillars of Visual Mastery")).toBeVisible();

  // Check Features
  await expect(page.getByText("Interactive DSA Animations")).toBeVisible();
  await expect(page.getByText("Try It Yourself")).toBeVisible();

  // Check Curriculum Preview
  await expect(
    page.getByRole("heading", { name: "Linked Lists" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Binary Trees & BST" }),
  ).toBeVisible();

  // Navigate to design system
  await page.goto("/design-system");
  await expect(
    page.getByRole("heading", { name: "A clearer way to think in systems." }),
  ).toBeVisible();
  await expect(page.getByTestId("health-response")).toContainText(
    '"status": "healthy"',
  );
});

test("responsive layout test from desktop to mobile without overflow", async ({
  page,
}) => {
  await page.goto("/");

  for (const width of [1440, 1280, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    const documentWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(documentWidth, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(
      width,
    );
    await expect(
      page.getByRole("heading", { name: /Understand DSA/i }),
    ).toBeVisible();
  }
});

test("page renders without browser console or unhandled runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Understand DSA/i }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
