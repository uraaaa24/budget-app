import type { CreateTransactionInput, Transaction } from '@/features/dashboard/model/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export async function fetchTransactions() {
  const response = await fetch(`${API_BASE_URL}/transactions`);

  if (!response.ok) {
    throw new Error('Failed to load transactions');
  }

  const data = (await response.json()) as { items: Transaction[] };
  return data.items;
}

export async function createTransaction(input: CreateTransactionInput) {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  return (await response.json()) as Transaction;
}
