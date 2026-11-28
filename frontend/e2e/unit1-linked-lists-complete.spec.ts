import { expect, test } from "@playwright/test";

test.describe("Unit I: Linked Lists & Memory Allocation Complete E2E Suite", () => {
  test("1. Curriculum Navigation Map lists all Unit I topics", async ({ page }) => {
    await page.goto("/curriculum");
    await expect(page.getByRole("heading", { name: "StructuraX Curriculum" })).toBeVisible();
    await expect(page.getByText("Memory Allocation & Linked Lists")).toBeVisible();
    await expect(page.getByText("Live — C Engine Powered")).toBeVisible();

    // Check all subtopic links
    await expect(page.getByRole("main").getByText("Static & Dynamic Memory")).toBeVisible();
    await expect(page.getByRole("main").getByText("Singly Linked List (13 Ops)")).toBeVisible();
    await expect(page.getByRole("main").getByText("Doubly Linked List (16 Ops)")).toBeVisible();
    await expect(page.getByRole("main").getByText("Circular Linked List (12 Ops)")).toBeVisible();
    await expect(page.getByRole("main").getByText("Polynomial & Applications")).toBeVisible();
  });

  test("2. Memory Allocation Workspace (Stack vs Heap, Malloc, Free, Leaks)", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (err) => pageErrors.push(err));

    await page.goto("/learn/memory-allocation");

    // Header & Concepts
    await expect(
      page.getByRole("heading", { name: "Static & Dynamic Memory Allocation" }),
    ).toBeVisible();

    // Interactive Lessons (1-8)
    await page.getByRole("button", { name: /Interactive Lessons/i }).click();
    await expect(page.getByText("Lesson 1: What is Memory?")).toBeVisible();
    await expect(page.getByText("Plain-English Definition")).toBeVisible();

    // Toggle Progressive Disclosure Views
    await page.getByRole("button", { name: "Technical C View" }).click();
    await expect(page.getByText("Exact C Standard Syntax")).toBeVisible();
    await page.getByRole("button", { name: "Beginner View" }).click();

    // Sandbox Tab
    await page.getByRole("button", { name: /Stack & Heap Sandbox/i }).click();
    await expect(page.getByText("Call Stack (Fixed / Automatic)")).toBeVisible();
    await expect(page.getByText("Heap Memory Space (Dynamic)")).toBeVisible();

    // Test malloc
    await page.getByRole("button", { name: "+ malloc(12B)" }).click();
    await expect(page.getByText(/allocated 12 uninitialized bytes/i)).toBeVisible();

    // Test calloc
    await page.getByRole("button", { name: "+ calloc(16B)" }).click();
    await expect(page.getByText(/allocated 16 zero-initialized bytes/i)).toBeVisible();

    // Test simulate leak
    await page.getByRole("button", { name: "Simulate Leak" }).click();
    await expect(page.getByText(/MEMORY LEAK DETECTED/i)).toBeVisible();

    // Test simulate dangling
    await page.getByRole("button", { name: "Simulate Dangling" }).click();
    await expect(page.getByText(/DANGLING POINTER WARNING/i)).toBeVisible();

    // Bug Labs Tab
    await page.getByRole("button", { name: /Memory Bug Labs/i }).click();
    await expect(page.getByText("Bug Lab 1: The Memory Leak")).toBeVisible();
    await page.getByRole("button", { name: "3. Use After Free" }).click();
    await expect(page.getByText("Bug Lab 3: Use After Free")).toBeVisible();
    await page.getByRole("button", { name: "4. Double Free" }).click();
    await expect(page.getByText("Bug Lab 4: Double Free Abort")).toBeVisible();

    // Predict tab
    await page.getByRole("button", { name: /Predict Behavior/i }).click();
    await page.getByText(/returns a NULL pointer/i).click();
    await expect(page.getByText(/Spot on!/i)).toBeVisible();

    expect(pageErrors).toHaveLength(0);
  });

  test("3. Doubly Linked List Workspace executes C engine operations", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (err) => pageErrors.push(err));

    await page.goto("/learn/doubly-linked-list");

    await expect(page.getByRole("heading", { name: "Doubly Linked List" })).toBeVisible();
    await expect(page.getByText("C Engine Ready")).toBeVisible();

    // Initial load trace
    await expect(page.getByText("C Engine Trace: DISPLAY")).toBeVisible();
    await expect(page.getByText("[HEAD]")).toBeVisible();
    await expect(page.getByText("[TAIL]")).toBeVisible();

    // Execute Traversal Backward
    const backwardBtn = page.getByRole("button", { name: /Traverse Backward/i });
    if (await backwardBtn.isVisible()) {
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes("/api/v1/execution/run") && res.status() === 200,
      );
      await backwardBtn.click();
      const res = await responsePromise;
      const data = await res.json();
      expect(data.validation.valid).toBe(true);
      expect(data.operation).toBe("TRAVERSE_BACKWARD");
    }

    // Predict step
    await page.getByRole("button", { name: "4. Predict Step" }).click();
    await page.getByText("head->prev = new_node;").click();
    await expect(page.getByText(/Correct!/i)).toBeVisible();

    expect(pageErrors).toHaveLength(0);
  });

  test("4. Circular Linked List Workspace displays loop connector and executes C engine", async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (err) => pageErrors.push(err));

    await page.goto("/learn/circular-linked-list");

    await expect(page.getByRole("heading", { name: "Circular Linked List" })).toBeVisible();
    await expect(page.getByText("C Engine Ready")).toBeVisible();

    // Initial load trace
    await expect(page.getByText("C Engine Trace: DISPLAY")).toBeVisible();
    await expect(page.getByText(/loops to head/i)).toBeVisible();

    // Execute Traverse Cycle
    const traverseBtn = page.getByRole("button", { name: /Traverse Cycle/i });
    if (await traverseBtn.isVisible()) {
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes("/api/v1/execution/run") && res.status() === 200,
      );
      await traverseBtn.click();
      const res = await responsePromise;
      const data = await res.json();
      expect(data.validation.valid).toBe(true);
      expect(data.operation).toBe("TRAVERSE");
    }

    // Sever cycle debugging
    await page.getByRole("button", { name: "5. Debugging" }).click();
    await page.getByRole("button", { name: "tail->next = head" }).click();
    await expect(page.getByText(/Circular topology restored/i)).toBeVisible();

    expect(pageErrors).toHaveLength(0);
  });

  test("5. Polynomial Workspace executes algebraic operations via C engine", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (err) => pageErrors.push(err));

    await page.goto("/learn/polynomial");

    await expect(
      page.getByRole("heading", { name: "Polynomial Arithmetic & Linked List Applications" }),
    ).toBeVisible();

    // Initial load runs ADD
    await expect(page.getByText("C Engine Trace: ADD")).toBeVisible();
    await expect(page.getByText(/Polynomial P1\(x\)/i)).toBeVisible();
    await expect(page.getByText(/Polynomial P2\(x\)/i)).toBeVisible();

    // Execute Multiply
    const multBtn = page.getByRole("button", { name: /Multiply/i });
    const multResponse = page.waitForResponse(
      (res) => res.url().includes("/api/v1/execution/run") && res.status() === 200,
    );
    await multBtn.click();
    const multRes = await multResponse;
    const multTrace = await multRes.json();
    expect(multTrace.validation.valid).toBe(true);
    expect(multTrace.operation).toBe("MULTIPLY");
    await expect(page.getByText("C Engine Trace: MULTIPLY")).toBeVisible();

    // Test Applications Tab (Stack and Queue via LL)
    await page.getByRole("button", { name: /Stack & Queue via LL/i }).click();
    await expect(page.getByText("TOP OF STACK (HEAD)")).toBeVisible();
    await page.getByRole("button", { name: /Push/i }).click();
    await page.getByRole("button", { name: /Pop/i }).click();

    // Switch to Queue
    await page.getByRole("button", { name: /Queue via Linked List/i }).click();
    await expect(page.getByText(/FRONT/i)).toBeVisible();
    await expect(page.getByText(/REAR/i)).toBeVisible();

    expect(pageErrors).toHaveLength(0);
  });
});
