import { test as base } from '@playwright/test';
import { TodoPage } from '@pages/todo.page';

/**
 * Extends the base Playwright test with a ready-to-use `todoPage` fixture.
 *
 * The fixture navigates to the app and clears `localStorage` before each
 * test so that scenarios never leak todos between test runs, and spec files
 * never need to repeat that setup boilerplate.
 */
export const test = base.extend<{ todoPage: TodoPage }>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.resetState();

    await use(todoPage);
  },
});

export { expect } from '@playwright/test';
