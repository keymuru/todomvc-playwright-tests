/**
 * Centralized test data for the TodoMVC suite.
 * Keeping literals here (instead of inline in specs) makes it trivial to
 * reuse the same fixtures across scenarios and to extend coverage later.
 */
export const TODO_ITEMS = {
  learnPlaywright: 'Learn Playwright',
  writeTests: 'Write tests',
} as const;

export const DEFAULT_TODO_TITLES = [TODO_ITEMS.learnPlaywright, TODO_ITEMS.writeTests] as const;
