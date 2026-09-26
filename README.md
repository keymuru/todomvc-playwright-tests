# TodoMVC Playwright E2E Suite

## Project structure

```
todomvc-playwright-tests/
├── playwright.config.ts        # Runner config: projects, baseURL, reporters, retries
├── tsconfig.json                # TS config + path aliases (@pages, @fixtures, @data)
├── src/
│   ├── pages/
│   │   └── todo.page.ts         # Page Object Model — all locators & user actions
│   ├── fixtures/
│   │   └── todo.fixtures.ts     # Custom `test`/`expect` with an auto-reset `todoPage` fixture
│   └── data/
│       └── todo.data.ts         # Shared test data constants
└── tests/
    └── todo-app/
        ├── add-todo.spec.ts                    # Scenarios 1-5: load app, add todo(s), verify list
        ├── todo-completion-and-filters.spec.ts # Scenarios 6-7: complete + Active/Completed filters
        └── clear-completed.spec.ts             # Scenario 8: clear completed (nice-to-have)
```



### Why this layout

- `src/pages` — one Page Object per app/page. Specs never touch raw CSS selectors; if the
DOM changes, only `todo.page.ts` needs updating.
- `src/fixtures` — extends Playwright's base `test` so every spec gets a ready-to-use,
already-reset `todoPage` fixture instead of repeating `goto()`/localStorage-clear boilerplate.
- `src/data` — test data lives in one typed module so it can be reused/extended without
touching spec files (e.g. adding a 3rd todo title later).
- `tests/<feature>` — specs are grouped by feature/behavior (not by "test 1", "test 2"), which
scales cleanly as more TodoMVC features (editing, "mark all", persistence, etc.) are added —
just add a new folder per page/feature and a `*.spec.ts` per behavior.
- Path aliases (`@pages/*`, `@fixtures/*`, `@data/*`) keep imports short and stable even if files  
move deeper into the tree.



## Getting started

Node Version Used : v20.13.1

```bash
npm install
npx playwright install        # first time only, downloads browser binaries
```

## Running tests

```bash
npm test                      # run the full suite (chromium, firefox, webkit)
npm run test:chromium         # single browser, faster local feedback loop
npm run test:smoke            # only @smoke-tagged tests, for a fast pre-merge check
npm run test:headed           # watch the browser while tests run
npm run test:ui               # Playwright's interactive UI mode
npm run test:report           # open the last HTML report
npm run typecheck             # TypeScript check with no emit
```



## How I used Cursor

- I explored the app and tried out the scenarios manually to get an understanding of the application and the expected behavior.
- I noted down the list of test scenarios along with the assertion points needed to make the tests robust.
- I asked Cursor to review the Todo app along with my observations to ensure I didn't miss anything.
- I drafted the project layout, including the structure, Page Object Model, data, fixtures, configuration script, and naming conventions, with examples.
- Installed and configured Playwright, wrote one standard test script, and then asked Cursor to do the heavy lifting — for example, expanding the remaining test scripts using Cursor's browser capability, project configuration, and validation.
- I intervened and did a manual review, corrected the configuration as needed, split the one full test script into three readable test scripts, verified the code readability and variable names to ensure they were relevant to the actions being performed, and contributed to the README.
- I asked Cursor to tag the smoke tests for quick build sign-off.
- I ran the full test suite as well as the smoke tests to verify the implementation.

## Test Strategy

The suite follows a layered approach:

- **Functional coverage:** Validates the requested TodoMVC user workflows.
- **Assertions:** Each major user action has a corresponding UI-state assertion.
- **Isolation:** Tests are independent and can be executed individually.
- **Smoke coverage:** Critical happy-path scenarios are tagged with `@smoke`.
- **Cross-browser coverage:** Full regression runs against Chromium, Firefox, and WebKit. Note: Commented out Firefox and Webkit for easy run.
- **Maintainability:** UI interaction logic is centralized in the Page Object Model, while test intent remains in the spec files.

## Extending the suite

- New TodoMVC behavior (e.g. inline editing, "mark all as complete", persistence across reload)?
Add the locator/action to `todo.page.ts`, then a new `*.spec.ts` under `tests/todo-app/`.
- New page/app entirely? Add `src/pages/<name>.page.ts` and `tests/<name>/`.
- Tag new smoke-critical tests with `{ tag: '@smoke' }` so they're covered by `npm run test:smoke`.

