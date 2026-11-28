import { expect, test } from "@playwright/test";

test.describe("Studio execution and playback speed", () => {
  test("SLL engine executes all required operations without failure", async ({ page }) => {
    await page.goto("/learn/singly-linked-list");
    await expect(page.getByText("C Engine Ready")).toBeVisible();
    await expect(page.getByText("Execution Failed")).not.toBeVisible();

    const operations = [
      ["Insert 7 at Front", "INSERT_FRONT"],
      ["Insert 99 at Back", "INSERT_BACK"],
      ["Delete Front Node", "DELETE_FRONT"],
      ["Search for 29", "SEARCH"],
      ["Traverse All", "TRAVERSE"],
      ["Reverse Iterative", "REVERSE_ITERATIVE"],
    ];

    for (const [button, operation] of operations) {
      await page.getByRole("button", { name: button }).click();
      await expect(page.getByText(`C Engine Trace: ${operation}`)).toBeVisible();
      await expect(page.getByText("Execution Failed")).not.toBeVisible();
    }
  });

  test("502 failures surface and engine badge is accurate", async ({ page }) => {
    await page.route("**/execution/run", (route) =>
      route.fulfill({ status: 502, contentType: "application/json", body: '{"detail":"Bad Gateway"}' }),
    );
    await page.goto("/learn/singly-linked-list");
    await expect(page.getByText("Engine Unavailable")).toBeVisible();
    await expect(page.getByText("C Engine Ready")).not.toBeVisible();
    await expect(page.getByText("Execution Failed")).toBeVisible();
  });

  test("speed defaults to 1x and does not leak across topics", async ({ page }) => {
    await page.goto("/learn/singly-linked-list");
    const speed = page.locator("select").filter({ has: page.locator("option[value='0.5']") }).first();
    await expect(speed).toHaveValue("1");

    await speed.selectOption("2");
    await expect(speed).toHaveValue("2");

    await page.goto("/learn/memory-allocation");
    await page.goto("/learn/singly-linked-list");
    const nextSpeed = page.locator("select").filter({ has: page.locator("option[value='0.5']") }).first();
    await expect(nextSpeed).toHaveValue("1");
    await expect(nextSpeed.locator("option")).toHaveText(["0.5x", "1.0x", "2.0x"]);
  });

  test("playback controls remain synchronized", async ({ page }) => {
    await page.goto("/learn/singly-linked-list");
    await expect(page.getByText(/C Engine Trace: DISPLAY/)).toBeVisible();
    await page.getByTitle("Step forward").click();
    await expect(page.getByText(/Step 2 of/)).toBeVisible();
    await page.getByTitle("Step back").click();
    await expect(page.getByText(/Step 1 of/)).toBeVisible();
    await page.getByRole("button", { name: "Play" }).click();
    await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
    await page.getByRole("button", { name: "Pause" }).click();
    await page.getByTitle("Reset").click();
    await expect(page.getByText(/Step 1 of/)).toBeVisible();
  });
});
