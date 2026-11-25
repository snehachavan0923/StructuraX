# StructuraX Setup Status

**Checked:** 2026-11-25  
**Scope:** Phase 1.1 setup and Phase 2 design-system foundation. No landing page, dashboard, full product navigation, learning page, or DSA syllabus content was implemented. The frontend currently renders an isolated design-system showcase with the existing live health integration.

## Summary

| Component | Status |
|---|---|
| React / TypeScript / Vite | Phase 2 design foundation implemented; type-check, unit tests, production build, and browser integration pass |
| FastAPI | Tests pass; live API served successfully in browser integration |
| PostgreSQL / Alembic | Running; application credentials work; migration `0001` is current |
| C DSA engine / CFFI | Fresh CMake configure, build and CTest pass with Apple Clang; the newly compiled library loads through the CFFI bridge |
| Frontend-to-backend | Passed in Playwright against the real `/api/v1/health` endpoint |
| Git / secrets | Repository already initialized; `.env` ignored and absent from reachable checkpoint commits |

## Completed and tested

### Frontend

- Created the React + TypeScript + Vite app under `frontend/`, with `package-lock.json`.
- Installed React 19.3.1, TypeScript 7.0.2, Vite 8.3.8, Tailwind CSS 4.3.5, Framer Motion 14.14.0, Zustand, React Router, TanStack Query, Axios, Lucide React, React Hook Form, Zod, Recharts, Vitest, React Testing Library, and Playwright.
- Configured Tailwind's Vite plugin and shadcn/ui's `components.json` aliases/style/base. The shadcn CLI recognized the configuration; its CLI package was removed from the dependency tree afterward to clear its transitive npm audit findings. The shadcn component-generation CLI is not a runtime dependency.
- Added a centralized Axios client and a temporary health-check view. It calls the real backend and has no fake health fallback.
- `cd frontend && npm install`: passed; lockfile is up to date.
- `cd frontend && npm run typecheck`: passed.
- `cd frontend && npm test`: **1 test passed**.
- `cd frontend && npm run build`: passed; Vite generated the production bundle.
- `cd frontend && npm audit`: **0 vulnerabilities**.
- `cd frontend && npm run test:e2e`: **1 Playwright browser test passed**. It received a live response with healthy API, database, and engine fields from `GET /api/v1/health`.
- Verified the configured backend CORS allowlist includes the normal Vite origins `http://127.0.0.1:5173` and `http://localhost:5173`. The browser integration used free test ports `5174` and `8011` (port 5173 was already occupied) and an explicit test-only CORS origin for 5174.

### Phase 2 design system

- Implemented the isolated component showcase in `frontend/src/App.tsx`; retained the actual TanStack Query health request and its real error/response states.
- Created CSS design tokens in `frontend/src/styles/tokens.css`, theme palettes in `frontend/src/styles/themes.css`, and reduced-motion overrides in `frontend/src/styles/animations.css`. Dark (`#090D18`), light (`#F6F8FC`), and system modes use semantic colors, font families, typography, spacing, layout, radius, elevation, and control-size tokens.
- Added persisted Zustand theme preference (`frontend/src/stores/theme-store.ts`), OS change subscription (`frontend/src/hooks/use-theme.ts`), theme type declarations, and an inline initial theme application in `frontend/index.html` to limit theme flash. Theme selection updates without reload and persists in local storage.
- Configured Space Grotesk, Inter, and JetBrains Mono font loading with system fallbacks. Google Fonts access is needed to load the named font files; local fallback fonts remain available offline.
- Added reusable React/TypeScript foundations: buttons, card variants, form controls, badges, tooltips, toast, progress, skeleton, empty/error states, theme switcher, navigation primitives, and SVG-compatible visualizer primitives. These use the existing React, Tailwind CSS, Lucide, Framer Motion, Zustand, and `cn` utility; no dependencies were added.
- Added reusable Framer Motion variants for fades, slides, scale, stagger, hover/press, page and modal transitions, plus a reduced-motion hook. The showcase demonstrates the reduced-motion preference.
- Added responsive showcase sections for tokens/type, component states, navigation, visualizer primitives, motion, and the live health endpoint. No actual DSA operation state or syllabus UI was introduced.
- Updated `frontend/src/App.test.tsx`, `frontend/src/test/setup.ts`, and added `frontend/src/components/ui/theme-switcher.test.tsx` for theme and showcase behavior. Added browser checks in `frontend/e2e/design-system.spec.ts`.
- Phase 2 validation (run in `frontend/`):

  ```sh
  npm run typecheck
  npm test
  npm run build
  npm run test:e2e
  ```

  Results: typecheck passed; **4 unit tests passed**; production build passed; **4 Playwright tests passed**, including original live API health integration, theme persistence, system preference changes, responsive widths (1440/768/390px without horizontal overflow), component-state checks, and no browser console/page errors. No npm install was required.
- Production build emits a non-failing Vite warning: the minified JS bundle is 512.34 kB (above the configured/default 500 kB advisory threshold). No dependency or splitting configuration was introduced solely to silence it.

### Backend and database

- Python 3.12.15 virtual environment and declared dependencies are installed; `uv lock --check` passed.
- `cd backend && .venv/bin/ruff check app tests`: passed.
- `cd backend && .venv/bin/pytest -q`: **6 passed**.
- PostgreSQL 16 is accepting connections. The application's configured credentials connected to `structurax_dev`; `SELECT 1` succeeded.
- `cd backend && .venv/bin/alembic current`: connected and reported `0001 (head)`.

### C engine and CFFI

- CMake 4.5.1 and Apple Clang 21 are installed. `xcrun --find clang` returned `/Library/Developer/CommandLineTools/usr/bin/clang`. CMake auto-detects `/usr/bin/cc` as `AppleClang 21.0.0.21000334`.
- `dsa-engine/CMakeLists.txt`, `include/structurax_engine.h`, `src/common/engine.c`, `src/common/trace.c` and `tests/test_engine.c` were inspected; no source-path, include-path or CMakeLists.txt change was required.
- The pre-existing `dsa-engine/build/libstructurax_engine.dylib` and the earlier `dsa-engine/build-fresh` build were left untouched. The latest independent verification used the newly created clean directory `dsa-engine/build-cmake-verify`.
- Current CMake configuration verification (2026-11-25, exit 0), run directly in the terminal with the compiler returned by `xcrun --find clang`:

  ```sh
  xcrun --find clang
  cmake -S dsa-engine -B dsa-engine/build-cmake-verify -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER="$(xcrun --find clang)"
  ```

  Compiler path: `/Library/Developer/CommandLineTools/usr/bin/clang` (Apple Clang 21.0.0.21000334). CMake selected `Unix Makefiles`; configuration and generation completed successfully.
- Current clean build (exit 0):

  ```sh
  cmake --build dsa-engine/build-cmake-verify --parallel
  ```

  Built `engine.c.o`, `trace.c.o`, `libstructurax_engine.dylib`, `test_engine.c.o`, and `engine_tests`.
- Current CTest run (exit 0):

  ```sh
  ctest --test-dir dsa-engine/build-cmake-verify --output-on-failure -V
  ```

  Result: `1/1 Test #1: engine_unit_tests ... Passed`; `100% tests passed, 0 tests failed out of 1`.
- Current CFFI verification (exit 0), run from `backend/` and explicitly loading the newly built dylib:

  ```sh
  DSA_ENGINE_LIBRARY_PATH=/Users/sujalchavan/Documents/StructureX/dsa-engine/build-cmake-verify/libstructurax_engine.dylib .venv/bin/python -c 'from app.engine_bridge.engine_loader.loader import load_engine; from app.engine_bridge.cffi_bridge.engine import get_ffi; h = load_engine(); ffi = get_ffi(); print("library:", h.path); print("version:", ffi.string(h.library.structurax_engine_version()).decode()); print("initialized:", h.library.structurax_engine_is_initialized()); t = h.library.structurax_test_operation(2, 3); print("trace:", ffi.string(t).decode()); h.library.structurax_free_string(t)'
  ```

  Result: loaded `.../dsa-engine/build-cmake-verify/libstructurax_engine.dylib`, version `0.1.0`, initialized `1`, and returned a valid JSON trace whose final sum is `5`.
- No `CMakeLists.txt` change was needed: the recorded configuration failure was caused by CMake Tools selecting unavailable Ninja; `.vscode/settings.json` already pins the installed `Unix Makefiles` generator. The direct clean configure above confirms the configuration now works with Apple Clang.
- Fresh configure (exit 0):

  ```sh
  cmake -S dsa-engine -B dsa-engine/build-fresh -DCMAKE_BUILD_TYPE=Debug
  ```

  Output included `-- The C compiler identification is AppleClang 21.0.0.21000334`, `-- Configuring done (0.6s)`, `-- Generating done (0.0s)` and `-- Build files have been written to: /Users/sujalchavan/Documents/StructureX/dsa-engine/build-fresh`.
- Fresh compile (exit 0):

  ```sh
  cmake --build dsa-engine/build-fresh --parallel
  ```

  All five steps succeeded: `engine.c.o`, `trace.c.o`, shared library `libstructurax_engine.dylib`, `test_engine.c.o`, and executable `engine_tests`.
- CTest (exit 0):

  ```sh
  ctest --test-dir dsa-engine/build-fresh --output-on-failure -V
  ```

  Result: `1/1 Test #1: engine_unit_tests ................ Passed 0.68 sec`, `100% tests passed out of 1`.
- CFFI verification of the **newly compiled** library (exit 0), run from `backend/` with the environment override so the fresh dylib is loaded instead of the old one:

  ```sh
  DSA_ENGINE_LIBRARY_PATH=/Users/sujalchavan/Documents/StructureX/dsa-engine/build-fresh/libstructurax_engine.dylib .venv/bin/python -c 'from app.engine_bridge.engine_loader.loader import load_engine; from app.engine_bridge.cffi_bridge.engine import get_ffi; h = load_engine(); ffi = get_ffi(); print("library:", h.path); print("version:", ffi.string(h.library.structurax_engine_version()).decode()); print("initialized:", h.library.structurax_engine_is_initialized()); t = h.library.structurax_test_operation(2, 3); print("trace:", ffi.string(t).decode()); h.library.structurax_free_string(t)'
  ```

  Result: `library: /Users/sujalchavan/Documents/StructureX/dsa-engine/build-fresh/libstructurax_engine.dylib`, `version: 0.1.0`, `initialized: 1`, and a complete JSON trace with `"sum":5`. The fresh dylib SHA-256 is `fa61199edf97140953e3c072c4b6d2bcc2f4ef71031787427b6ad52848acae7f`, which differs from the pre-existing library (`83339e4abd49b3c0b32dd5890d5b33f7d0b329d1285f5614735b934d3967205b`), confirming the CFFI check used the new build.
- Backend engine bridge and trace-parser tests pass: the Python process loads and initializes the shared library, calls its C operation, and parses the returned trace.
- The browser health integration also reports the real C engine as healthy.

### Git and security

- Git is already initialized at the project root. No `git init` was run and no files were staged or committed.
- The current checkout has no `HEAD` and no index-tracked files, but reachable agent checkpoint refs contain five commits; those refs and their history were preserved.
- `.env` is ignored by `.gitignore` (`*.env`) and is not tracked. No `.env` path appears in the reachable commit trees; `.env.example` is the only environment-like committed path and contains placeholders.
- A targeted scan of reachable checkpoint commits found no common AWS/GitHub/OpenAI/private-key token patterns or likely credential assignments. This is a pattern-based scan, not a guarantee against every possible secret format.

## Incomplete / failed checks

### Other directories

- `database/`, `docs/`, and `infrastructure/` contain no files in this checkout; schema/seeds and deployment configuration remain unverified.

## Resolved issues encountered during this phase

- **TypeScript configuration:** initial check reported `tsconfig.app.json(20,5): error TS5102: Option 'baseUrl' has been removed.` Removed `baseUrl`; TypeScript check now passes.
- **Vitest test discovery:** initial run included `e2e/health.spec.ts` and failed with `Playwright Test did not expect test() to be called here.` Restricted Vitest discovery to `src/`; unit tests now pass separately from Playwright.
- **Port conflicts:** initial browser-server attempt failed with `[Errno 48] error while attempting to bind on address ('127.0.0.1', 8000): address already in use`. The occupied port served HTTP 404 for this API. Switched integration servers to free ports 8011 and 5174 without stopping or altering the existing listener.
- **Playwright base URL:** first integration attempt timed out with `page.waitForResponse: Test timeout of 30000ms exceeded` because the test still targeted occupied port 5173. Corrected the base URL to 5174; the live browser integration now passes.
- **npm audit:** the temporary shadcn CLI dependency introduced four moderate `minimatch` advisories, with `npm audit fix --force` proposing a breaking CLI change. Removed the CLI package rather than force-upgrading; shadcn configuration remains in place and the final audit reports zero vulnerabilities.
- **CMake configure failure:** the earlier VS Code CMake Tools actions only exposed the generic `Unable to configure the project`. Running CMake directly from the terminal showed configuration succeeds; the reproducible failure mode was a selected Ninja generator, which is not installed here: `CMake Error: CMake was unable to find a build program corresponding to "Ninja". CMAKE_MAKE_PROGRAM is not set.` followed by `CMake Error: CMAKE_C_COMPILER not set, after EnableLanguage`. `ninja` is absent and `/usr/bin/make` is present. Updated `.vscode/settings.json` to use `${workspaceFolder}`-relative source/build directories and to pin `"cmake.generator": "Unix Makefiles"`. A separate clean configure with `-G "Unix Makefiles" -DCMAKE_C_COMPILER="$(xcrun --find clang)"` also succeeded with AppleClang 21.0.0.21000334. No CMakeLists.txt change was needed.

## Warnings

- npm reports the optional `fsevents@2.3.3` install script is not covered by its `allowScripts` list; install, type-check, build, and tests still pass.
- Backend tests emit the existing Starlette warning: `Using httpx with starlette.testclient is deprecated; install httpx2 instead.` It does not fail tests.

## Final verification commands

```sh
cd frontend
npm install
npm run typecheck
npm test
npm run build
npm audit
npm run test:e2e

cd ../backend
.venv/bin/ruff check app tests
.venv/bin/pytest -q
.venv/bin/alembic current
```

C engine verification from a clean build directory (run at the repository root; leave `dsa-engine/build` untouched):

```sh
xcrun --find clang
cmake -S dsa-engine -B dsa-engine/build-cmake-verify -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER="$(xcrun --find clang)"
cmake --build dsa-engine/build-cmake-verify --parallel
ctest --test-dir dsa-engine/build-cmake-verify --output-on-failure -V

cd backend
DSA_ENGINE_LIBRARY_PATH=/Users/sujalchavan/Documents/StructureX/dsa-engine/build-cmake-verify/libstructurax_engine.dylib .venv/bin/python -c 'from app.engine_bridge.engine_loader.loader import load_engine; from app.engine_bridge.cffi_bridge.engine import get_ffi; h = load_engine(); ffi = get_ffi(); print("library:", h.path); print("version:", ffi.string(h.library.structurax_engine_version()).decode()); print("initialized:", h.library.structurax_engine_is_initialized()); t = h.library.structurax_test_operation(2, 3); print("trace:", ffi.string(t).decode()); h.library.structurax_free_string(t)'
```
