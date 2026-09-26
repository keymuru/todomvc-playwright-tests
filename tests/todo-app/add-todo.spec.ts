import { expect, test } from '@fixtures/todo.fixtures';
import { TODO_ITEMS } from '@data/todo.data';

/**
 * Covers app load plus adding one or more todos to the list.
 */
test.describe('Adding todos', () => {
  test('loads the app with an empty todo list', { tag: '@smoke' }, async ({ todoPage }) => {
    await expect(todoPage.page).toHaveTitle(/TodoMVC/);
    await expect(todoPage.newTodoInput).toBeVisible();
    await expect(todoPage.newTodoInput).toBeFocused();
    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('adds a single todo and shows it in the list', { tag: '@smoke' }, async ({ todoPage }) => {
    await test.step('add "Learn Playwright"', async () => {
      await todoPage.addTodo(TODO_ITEMS.learnPlaywright);
    });

    await test.step('verify it appears in the list', async () => {
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.itemByTitle(TODO_ITEMS.learnPlaywright)).toBeVisible();
      await expect(todoPage.newTodoInput).toBeEmpty();
    });
  });

  test('adds a second todo and lists both in creation order', async ({ todoPage }) => {
    await test.step('add two todos', async () => {
      await todoPage.addTodo(TODO_ITEMS.learnPlaywright);
      await todoPage.addTodo(TODO_ITEMS.writeTests);
    });

    await test.step('verify there are 2 items in the list', async () => {
      await expect(todoPage.todoItems).toHaveCount(2);
      await expect(todoPage.todoCount).toContainText('2 items left');
    });

    await test.step('verify both titles are present, in the order they were added', async () => {
      await expect(await todoPage.visibleTitles()).toEqual([
        TODO_ITEMS.learnPlaywright,
        TODO_ITEMS.writeTests,
      ]);
    });
  });
});
