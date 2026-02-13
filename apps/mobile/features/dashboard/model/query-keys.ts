export const expenseQueryKeys = {
  all: ['expenses'] as const,
  list: () => [...expenseQueryKeys.all, 'list'] as const,
};
