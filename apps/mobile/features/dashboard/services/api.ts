import type { CreateExpenseInput, Expense } from '@/features/dashboard/model/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export async function fetchExpenses() {
  const response = await fetch(`${API_BASE_URL}/expenses`);

  if (!response.ok) {
    throw new Error('Failed to load expenses');
  }

  const data = (await response.json()) as { items: Expense[] };
  return data.items;
}

export async function createExpense(input: CreateExpenseInput) {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to create expense');
  }

  return (await response.json()) as Expense;
}
