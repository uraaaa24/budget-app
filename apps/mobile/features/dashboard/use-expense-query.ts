import { useCallback, useMemo, useState } from 'react';
import { fetchExpenses } from '@/features/dashboard/api';
import type { Expense } from '@/features/dashboard/types';

export function useExpenseQuery() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [queryError, setQueryError] = useState<string | null>(null);

  const loadExpenses = useCallback(async () => {
    try {
      const items = await fetchExpenses();
      setExpenses(items);
      setQueryError(null);
    } catch {
      setQueryError('Failed to load expenses. Is backend running on port 3001?');
    }
  }, []);

  const totalAmount = useMemo(
    () => expenses.reduce((total, item) => total + item.amount, 0),
    [expenses],
  );

  return {
    expenses,
    totalAmount,
    queryError,
    loadExpenses,
  };
}
