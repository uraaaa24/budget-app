import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionQueryKeys } from '@/features/dashboard/model/query-keys';
import { fetchTransactions } from '@/features/dashboard/services/api';

export function useTransactionQuery() {
  const { data, isError } = useQuery({
    queryKey: transactionQueryKeys.list(),
    queryFn: fetchTransactions,
  });

  const transactions = useMemo(() => data ?? [], [data]);

  const summary = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === 'income')
      .reduce((total, item) => total + item.amount, 0);
    const expense = transactions
      .filter((item) => item.type === 'expense')
      .reduce((total, item) => total + item.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  return {
    transactions,
    summary,
    queryError: isError ? 'Failed to load transactions. Is backend running on port 3001?' : null,
  };
}
