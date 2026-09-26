import { expect, test } from '@fixtures/todo.fixtures';
import { TODO_ITEMS } from '@data/todo.data';

/**
 * Optional nice-to-have scenario: clearing completed todos should remove
 * them from the list while leaving active todos untouched.
 */
test.describe('Clearing completed todos', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.addTodo(TODO_ITEMS.learnPlaywright);
    await todoPage.addTodo(TODO_ITEMS.writeTests);
    await todoPage.toggleTodo(TODO_ITEMS.learnPlaywright);
  });

  test('removes completed todos and keeps active ones', async ({ todoPage }) => {
    await expect(todoPage.clearCompletedButton).toBeVisible();

    await todoPage.clearCompleted();

    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.itemByTitle(TODO_ITEMS.writeTests)).toBeVisible();
    await expect(todoPage.itemByTitle(TODO_ITEMS.learnPlaywright)).toHaveCount(0);
    await expect(todoPage.clearCompletedButton).toHaveCount(0);
  });

  test('"All" filter no longer lists the cleared todo after reload', async ({ todoPage }) => {
    await todoPage.clearCompleted();
    await todoPage.page.reload();

    await todoPage.filterBy('all');
    await expect(todoPage.filters.all).toHaveClass(/selected/);

    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.itemByTitle(TODO_ITEMS.writeTests)).toBeVisible();
  });
});
