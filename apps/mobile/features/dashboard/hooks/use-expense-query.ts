import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { expenseQueryKeys } from '@/features/dashboard/model/query-keys';
import { fetchExpenses } from '@/features/dashboard/services/api';

export function useExpenseQuery() {
  const { data, isError } = useQuery({
    queryKey: expenseQueryKeys.list(),
    queryFn: fetchExpenses,
  });

  const expenses = useMemo(() => data ?? [], [data]);

  const totalAmount = useMemo(
    () => expenses.reduce((total, item) => total + item.amount, 0),
    [expenses],
  );

  return {
    expenses,
    totalAmount,
    queryError: isError ? 'Failed to load expenses. Is backend running on port 3001?' : null,
  };
}
