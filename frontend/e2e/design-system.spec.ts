import { expect, test } from "@playwright/test";

test("theme preferences persist and system mode follows the OS", async ({
  page,
}) => {
  await page.goto("/");

  const theme = page.getByRole("combobox", { name: "Color theme" });
  await theme.selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.getByRole("combobox", { name: "Color theme" })).toHaveValue(
    "dark",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("combobox", { name: "Color theme" }).selectOption("system");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("component states and layouts remain usable from desktop to mobile", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Disabled" })).toBeDisabled();
  await expect(page.getByRole("progressbar", { name: "Module progress" })).toHaveAttribute(
    "aria-valuenow",
    "68",
  );
  await expect(page.getByTestId("health-response")).toContainText(
    '"status": "healthy"',
  );

  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const documentWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(documentWidth, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(
      width,
    );
    await expect(
      page.getByRole("heading", { name: "A clearer way to think in systems." }),
    ).toBeVisible();
  }
});

test("showcase renders without browser console or page errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "A clearer way to think in systems." }),
  ).toBeVisible();
  await expect(page.getByTestId("health-response")).toContainText(
    '"status": "healthy"',
  );
  expect(errors).toEqual([]);
});
