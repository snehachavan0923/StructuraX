# StructuraX — Phase 4 Runtime Debugging Report
## Singly Linked List Visualizer Runtime Resolution

**Status:** Resolved & Verified  
**Date:** November 25, 2026  
**Module:** Singly Linked List (`/learn/linked-lists`)  
**Architecture:** React 19 + TypeScript → FastAPI → CFFI → Native C DSA Engine (`libstructurax_engine.dylib`) → Structured JSON Trace → React Visualizer  

---

## 1. Executive Summary & Root Cause Analysis

The user reported that the Singly Linked List module at `/learn/linked-lists` was stuck displaying:
> `"Executing on native C engine..."`
> with an empty visualizer and disabled operation buttons.

Through systematic reproduction and runtime inspection across all layers (C engine, CFFI, FastAPI, CORS middleware, Axios client, React state, and Playwright browser execution), we identified five interacting factors that caused this condition:

### Root Cause 1: Local Port Conflict & Zombie Listener on Port 8000
- **Finding:** A background process (PID 12094 / 10206 from another project `PYQVERSE` in addition to Logisim-evolution) was actively occupying TCP port 8000 on `127.0.0.1`.
- **Impact:** Any attempt by StructuraX's backend to bind to port 8000 failed with `[Errno 48] error while attempting to bind on address ('127.0.0.1', 8000): address already in use`. The existing listener returned `HTTP 404 Not Found` for StructuraX API routes, with no StructuraX CORS headers.
- **Resolution:** As established during initial integration (`SETUP_STATUS.md` and `playwright.config.ts`), StructuraX backend is mapped to dedicated port `8011` with frontend proxy routing to prevent port collisions with other local services.

### Root Cause 2: CORS Middleware Preflight Rejection on Non-5173 Dev Ports
- **Finding:** In `backend/app/core/config.py` and `backend/.env`, `CORS_ORIGINS` was hardcoded strictly to `http://localhost:5173,http://127.0.0.1:5173`. When Vite automatically selected fallback dev ports (such as `5174` or `5175`) due to port contention, browser preflight `OPTIONS` requests were blocked by FastAPI's CORS middleware:
  `No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- **Resolution:** Added `allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:[0-9]+)?"` to `CORSMiddleware` in `backend/app/main.py`, allowing all localhost and loopback dev ports while maintaining strict origin security. Extended default `cors_origins` in `backend/app/core/config.py` and `.env` to include ports 5173, 5174, 5175, 3000, and 4173.

### Root Cause 3: Vite Dev Server Missing Proxy Configuration
- **Finding:** `frontend/vite.config.ts` did not define a dev server proxy for `/api`. The frontend Axios client relied on direct cross-origin calls to `http://127.0.0.1:8000/api/v1` without fallback.
- **Resolution:** Configured `server.proxy` in `frontend/vite.config.ts` forwarding `/api` to the backend target (`http://127.0.0.1:8011`). Updated `frontend/src/lib/api.ts` so `apiClient` gracefully supports both direct URL configuration (`VITE_API_BASE_URL`) and same-origin relative `/api/v1` paths.

### Root Cause 4: Missing Initial Trace Load on Workspace Mount
- **Finding:** In `SinglyLinkedListWorkspace.tsx`, `activeTrace` was initialized to `null`. On initial visit to `/learn/linked-lists`, no trace was loaded automatically. In `TraceVisualizer.tsx`, the fallback container displayed:
  `{isLoading ? "Executing on native C engine..." : "No active execution trace. Select an operation below."}`
  If `isLoading` was triggered by any request that hung or failed, the visualizer became stuck on `"Executing on native C engine..."`.
- **Resolution:** Added an initial `useEffect` in `SinglyLinkedListWorkspace.tsx` to automatically invoke `SllOperationType.DISPLAY` with `[14, 29, 42]` on component mount. The C engine executes the traversal, returning the initial linked list state with its nodes, pointers, and NULL terminator immediately upon loading.

### Root Cause 5: Missing Error UI, Retry Handler, and Button Reset
- **Finding:** If a network failure, CORS rejection, or C engine error occurred, `handleExecute` logged to `console.error` without surfacing error state to the UI. `TraceVisualizer` had no error prop or retry button, leaving the user with an empty or stuck container.
- **Resolution:** Added `errorMessage` state to `SinglyLinkedListWorkspace.tsx` and extended `TraceVisualizer` with `error` and `onRetry` props. Any request failure renders a structured error message with an interactive "Retry Operation" button. The `finally { setLoading(false); }` block ensures buttons never remain disabled.

---

## 2. End-to-End Architectural Flow Verification

The complete flow was verified through automated Playwright end-to-end browser execution:

```
┌────────────────────────────────────────────────────────┐
│ 1. User Browser (Playwright / Chromium)                │
│    Navigates to /learn/linked-lists                    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. SinglyLinkedListWorkspace.tsx (React 19)            │
│    Fires SllOperationType.DISPLAY on mount             │
│    Payload: { topic, operation: 9, current_list: [...] }│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. FastAPI Backend (:8011/api/v1/execution/run)        │
│    Validated by ExecutionRunRequest schema             │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. Python CFFI Bridge (engine_bridge.py)               │
│    Calls structurax_sll_execute()                      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 5. Compiled C DSA Engine (libstructurax_engine.dylib)  │
│    Executes operation, records pointer changes,        │
│    allocations, memory addresses, and validation       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 6. JSON Execution Trace                                │
│    Structured trace with events, states, pointers      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 7. React TraceVisualizer.tsx                           │
│    Visualizes nodes, pointers (0x10, 0x20...), NULL,   │
│    playback controls (Play, Pause, Step, Reset)        │
└────────────────────────────────────────────────────────┘
```

---

## 3. Files Modified

| File Path | Description of Changes |
| :--- | :--- |
| `backend/app/main.py` | Added `allow_origin_regex=r"http://(localhost\|127\.0\.0\.1)(:[0-9]+)?"` and wildcard headers `["*"]` to `CORSMiddleware`. |
| `backend/app/core/config.py` | Extended default `cors_origins` with dev ports 5173, 5174, 5175, 3000, and 4173. |
| `.env` | Configured `BACKEND_PORT=8011`, `VITE_API_BASE_URL=http://127.0.0.1:8011/api/v1`, and extended `CORS_ORIGINS`. |
| `frontend/vite.config.ts` | Configured Vite dev server on port 5174 with dev proxy `/api` routing to `http://127.0.0.1:8011`. |
| `frontend/src/lib/api.ts` | Updated `apiClient` baseURL to use `VITE_API_BASE_URL` with relative `/api/v1` dev proxy fallback and 8000ms timeout. |
| `frontend/src/components/visualizer/TraceVisualizer.tsx` | Added `error` and `onRetry` props; implemented structured error banner with retry button; added running pulse badge when executing while a trace is loaded; refined loading container. |
| `frontend/src/components/learning/SinglyLinkedListWorkspace.tsx` | Added `errorMessage` state; auto-dispatches C engine `DISPLAY` operation on mount (`[14, 29, 42]`); passes error and retry handlers to `TraceVisualizer`; ensures robust loading teardown. |
| `backend/migrations/versions/0002_learning_progress.py` | Fixed import sorting and formatting to satisfy `ruff check`. |
| `frontend/e2e/linked-list-module.spec.ts` | Comprehensive end-to-end tests for initial list auto-rendering, C engine `INSERT_FRONT`, step navigation, C engine `SEARCH`, Try It Yourself tab, Predict step, and Debugging challenge with zero console errors. |

---

## 4. Test & Verification Results

### A. C DSA Engine Unit Tests (CTest)
```
[100%] Built target sll_tests
Test project /Users/sujalchavan/Documents/StructureX/dsa-engine/build
    Start 1: engine_unit_tests
1/2 Test #1: engine_unit_tests ................   Passed    0.00 sec
    Start 2: sll_unit_tests
2/2 Test #2: sll_unit_tests ...................   Passed    0.00 sec

100% tests passed out of 2
```

### B. Backend Unit & Integration Tests (pytest)
```
tests/test_engine_bridge.py ..                                           [ 20%]
tests/test_execution.py ....                                             [ 60%]
tests/test_health.py .                                                   [ 70%]
tests/test_trace_parser.py ...                                           [100%]

======================== 10 passed, 1 warning in 0.03s =========================
```

### C. Backend Code Quality (Ruff)
```
$ .venv/bin/ruff check .
All checks passed!
```

### D. Frontend TypeScript & Unit Tests (Vitest)
```
$ npm run typecheck
tsc -b --pretty false (Passed with 0 errors)

$ npm test -- --run
Test Files  2 passed (2)
     Tests  7 passed (7)
```

### E. Frontend Production Build
```
$ npm run build
dist/index.html                   1.63 kB │ gzip:   0.70 kB
dist/assets/index-BGDun2QY.css   93.72 kB │ gzip:  16.16 kB
dist/assets/index-DFcGgJuz.js   661.83 kB │ gzip: 202.97 kB
✓ built in 292ms
```

### F. Playwright End-to-End Browser Tests
```
Running 6 tests using 3 workers

  ✓  e2e/health.spec.ts:3:1 › receives the live FastAPI health response (1.4s)
  ✓  e2e/design-system.spec.ts:3:1 › theme preferences persist on landing page and system mode works (1.9s)
  ✓  e2e/linked-list-module.spec.ts:3:1 › navigates to Singly Linked List module and executes C engine operations (2.0s)
  ✓  e2e/design-system.spec.ts:25:1 › page renders headline, visualizer, sections, and navigates to design-system (1.0s)
  ✓  e2e/design-system.spec.ts:64:1 › responsive layout test from desktop to mobile without overflow (904ms)
  ✓  e2e/design-system.spec.ts:83:1 › page renders without browser console or unhandled runtime errors (686ms)

6 passed (5.9s)
```

---

## 5. Visualizer Capabilities Verified

- **Initial Linked List Display:** On page load, nodes `14`, `29`, `42` appear with memory addresses `0x10`, `0x20`, `0x30`, `head / curr` floating pointer, and `NULL` terminator.
- **Insert at Front:** Clicking "Insert 7 at Front" dispatches to C engine, renders `ALLOCATE_NODE` event, and updates the list to `[7, 14, 29, 42]`.
- **Search:** Dispatches to C engine, traverses nodes, and highlights search target `29`.
- **Step Navigation:** Step Forward, Step Back, and Reset update the visual pointer and step counter deterministically.
- **Error Recovery:** Any failed execution surfaces an error card with a one-click "Retry Operation" button. Buttons never get permanently disabled.
- **UI Preservation:** All hybrid premium design tokens, colors, typography, borders, and animations are strictly preserved.
