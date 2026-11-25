import { expect, test } from "@playwright/test";

test("receives the live FastAPI health response", async ({ page }) => {
  const healthResponse = page.waitForResponse(
    (response) => response.url() === "http://127.0.0.1:8011/api/v1/health",
  );

  await page.goto("/design-system");

  const response = await healthResponse;
  expect(response.ok()).toBe(true);

  const payload = await response.json();
  expect(payload.status).toBe("healthy");
  expect(payload.api).toBe("healthy");
  expect(payload.database.status).toBe("healthy");
  expect(payload.engine.status).toBe("healthy");

  await expect(page.getByTestId("health-response")).toContainText(
    '"status": "healthy"',
  );
});
