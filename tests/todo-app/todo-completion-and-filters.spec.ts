import { expect, test } from '@fixtures/todo.fixtures';
import { TODO_ITEMS } from '@data/todo.data';

/**
 * Covers marking a todo as completed and verifying the Active/Completed
 * filters reflect that change.
 */
test.describe('Completing todos and filtering the list', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.addTodo(TODO_ITEMS.learnPlaywright);
    await todoPage.addTodo(TODO_ITEMS.writeTests);
  });

  test('marks a todo as completed', { tag: '@smoke' }, async ({ todoPage }) => {
    await todoPage.toggleTodo(TODO_ITEMS.learnPlaywright);

    const completedItem = todoPage.itemByTitle(TODO_ITEMS.learnPlaywright);
    await expect(completedItem).toHaveClass(/completed/);
    await expect(completedItem.getByRole('checkbox')).toBeChecked();
    await expect(todoPage.todoCount).toContainText('1 item left');
  });

  test('"Completed" filter shows only the completed item', async ({ todoPage }) => {
    await todoPage.toggleTodo(TODO_ITEMS.learnPlaywright);

    await todoPage.filterBy('completed');
    await expect(todoPage.filters.completed).toHaveClass(/selected/);

    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.itemByTitle(TODO_ITEMS.learnPlaywright)).toBeVisible();
    await expect(todoPage.itemByTitle(TODO_ITEMS.writeTests)).toHaveCount(0);
  });

  test('"Active" filter shows only the remaining incomplete item', async ({ todoPage }) => {
    await todoPage.toggleTodo(TODO_ITEMS.learnPlaywright);

    await todoPage.filterBy('active');
    await expect(todoPage.filters.active).toHaveClass(/selected/);

    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.itemByTitle(TODO_ITEMS.writeTests)).toBeVisible();
    await expect(todoPage.itemByTitle(TODO_ITEMS.learnPlaywright)).toHaveCount(0);
  });
});
