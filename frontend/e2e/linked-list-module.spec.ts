import { expect, test } from "@playwright/test";

test("navigates to Singly Linked List module and executes C engine operations", async ({
  page,
}) => {
  // Capture any uncaught page errors
  const pageErrors: Error[] = [];
  page.on("pageerror", (err) => pageErrors.push(err));

  await page.goto("/learn/linked-lists");

  // Verify Workspace Header & Connection Badge
  await expect(page.getByRole("heading", { name: "Singly Linked List" })).toBeVisible();
  await expect(page.getByText("C Engine Ready")).toBeVisible();

  // Verify that the initial list is automatically loaded from the C engine on mount
  await expect(page.getByText("C Engine Trace: DISPLAY")).toBeVisible();
  await expect(page.getByText("NULL")).toBeVisible();
  await expect(page.getByText("14", { exact: true })).toBeVisible();
  await expect(page.getByText("29", { exact: true })).toBeVisible();
  await expect(page.getByText("42", { exact: true })).toBeVisible();

  // Test Stage 1: Learn Concept
  await page.getByRole("button", { name: "1. Concept" }).click();
  await expect(page.getByText("Singly Linked List Foundations")).toBeVisible();
  await expect(page.getByText("Data Field (Value)")).toBeVisible();

  // Test Stage 2: Watch Animation & Real C Engine Execution
  await page.getByRole("button", { name: "2. Watch Animation" }).click();
  const insertBtn = page.getByRole("button", { name: "Insert 7 at Front" });
  await expect(insertBtn).toBeVisible();

  // Trigger operation and wait for C engine response
  const runResponse = page.waitForResponse(
    (res) => res.url().includes("/api/v1/execution/run") && res.status() === 200,
  );
  await insertBtn.click();
  const res = await runResponse;
  const trace = await res.json();
  expect(trace.schema_version).toBe("1.0.0");
  expect(trace.operation).toBe("INSERT_FRONT");
  expect(trace.validation.valid).toBe(true);

  // Verify visualizer displays C Engine Trace details
  await expect(page.getByText("C Engine Trace: INSERT_FRONT")).toBeVisible();
  await expect(page.getByText("EVENT: ALLOCATE_NODE")).toBeVisible();

  // Verify step navigation controls work
  const stepForwardBtn = page.getByTitle("Step forward");
  await expect(stepForwardBtn).toBeVisible();
  await stepForwardBtn.click();
  await expect(page.getByText(/Step 2 of/i)).toBeVisible();

  const resetBtn = page.getByTitle("Reset");
  await resetBtn.click();
  await expect(page.getByText(/Step 1 of/i)).toBeVisible();

  // Test Search Operation via C Engine
  const searchBtn = page.getByRole("button", { name: "Search for 29" });
  const searchResponse = page.waitForResponse(
    (res) => res.url().includes("/api/v1/execution/run") && res.status() === 200,
  );
  await searchBtn.click();
  const searchRes = await searchResponse;
  const searchTrace = await searchRes.json();
  expect(searchTrace.operation).toBe("SEARCH");
  expect(searchTrace.validation.valid).toBe(true);
  await expect(page.getByText("C Engine Trace: SEARCH")).toBeVisible();

  // Test Stage 3: Try It Yourself
  await page.getByRole("button", { name: "3. Try It Yourself" }).click();
  await expect(page.getByText(/Insert Node/i)).toBeVisible();
  const tryInsertFrontBtn = page.getByRole("button", { name: "Front", exact: true });
  await expect(tryInsertFrontBtn).toBeVisible();

  // Test Stage 4: Predict the Next Step
  await page.getByRole("button", { name: "4. Predict Step" }).click();
  await expect(page.getByRole("heading", { name: "Predict the Next Pointer Assignment" })).toBeVisible();
  await page.getByText("new_node->next = head;").click();
  await expect(page.getByText(/Correct!/i)).toBeVisible();

  // Test Stage 5: Debugging Challenge
  await page.getByRole("button", { name: "5. Debugging" }).click();
  await expect(page.getByRole("heading", { name: "Fix the Infinite Cycle Bug" })).toBeVisible();
  await page.getByRole("button", { name: /Sever Cycle/i }).click();
  await expect(page.getByText(/Cycle severed!/i)).toBeVisible();

  // Verify no uncaught console/runtime errors occurred
  expect(pageErrors).toHaveLength(0);
});
