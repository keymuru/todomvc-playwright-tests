import { expect, type Locator, type Page } from '@playwright/test';

/** The three routes TodoMVC exposes via the URL hash for filtering the list. */
export type TodoFilter = 'all' | 'active' | 'completed';

/**
 * Page Object for the TodoMVC app (https://demo.playwright.dev/todomvc).
 *
 * Encapsulates every locator and user interaction for the todo list so that
 * spec files stay focused on scenarios/assertions instead of raw selectors.
 * If the app's markup ever changes, only this file needs to be updated.
 */
export class TodoPage {
  readonly page: Page;

  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly toggleAllCheckbox: Locator;
  readonly todoCount: Locator;
  readonly clearCompletedButton: Locator;
  readonly filters: {
    all: Locator;
    active: Locator;
    completed: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.toggleAllCheckbox = page.getByLabel('Mark all as complete');
    this.todoCount = page.getByTestId('todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });

    this.filters = {
      all: page.getByRole('link', { name: 'All' }),
      active: page.getByRole('link', { name: 'Active' }),
      completed: page.getByRole('link', { name: 'Completed' }),
    };
  }

  /** Navigates to the app root and waits for a clean, empty todo list. */
  async goto(): Promise<void> {
    // Relative to `baseURL` (kept trailing-slash-terminated in the config)
    // so the "/todomvc" path segment is preserved instead of being reset
    // to the site origin, as a leading "/" would do.
    await this.page.goto('./');
    await expect(this.newTodoInput).toBeVisible();
  }

  /** Clears any state persisted from a previous run so every test starts fresh. */
  async resetState(): Promise<void> {
    await this.page.evaluate(() => window.localStorage.clear());
    await this.page.reload();
    await expect(this.newTodoInput).toBeVisible();
  }

  /** Types a todo title into the input and submits it with Enter. */
  async addTodo(title: string): Promise<void> {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
  }

  /** Convenience helper to add several todos in sequence, preserving order. */
  async addTodos(titles: readonly string[]): Promise<void> {
    for (const title of titles) {
      await this.addTodo(title);
    }
  }

  /** Returns the row locator for a single todo, scoped by its visible title. */
  itemByTitle(title: string): Locator {
    return this.todoItems.filter({ hasText: title });
  }

  /** Toggles the completed checkbox for the todo with the given title. */
  async toggleTodo(title: string): Promise<void> {
    await this.itemByTitle(title).getByRole('checkbox', { name: 'Toggle Todo' }).click();
  }

  /** Deletes the todo with the given title via its destroy ("x") button. */
  async deleteTodo(title: string): Promise<void> {
    const item = this.itemByTitle(title);
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  /** Switches the list view using the footer filter links (All / Active / Completed). */
  async filterBy(filter: TodoFilter): Promise<void> {
    await this.filters[filter].click();
  }

  /** Clicks "Clear completed" in the footer. */
  async clearCompleted(): Promise<void> {
    await this.clearCompletedButton.click();
  }

  /** Returns the titles of every todo currently rendered in the list, in DOM order. */
  async visibleTitles(): Promise<string[]> {
    return this.todoItems.getByTestId('todo-title').allTextContents();
  }
}
