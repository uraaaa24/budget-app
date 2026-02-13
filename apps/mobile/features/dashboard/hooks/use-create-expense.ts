import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseQueryKeys } from '@/features/dashboard/model/query-keys';
import type { CreateExpenseInput } from '@/features/dashboard/model/types';
import { createExpense } from '@/features/dashboard/services/api';

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createExpense,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: expenseQueryKeys.list() });
    },
  });

  const submitExpense = useCallback(
    async (input: CreateExpenseInput) => {
      try {
        await mutation.mutateAsync(input);
      } catch {
        throw new Error('submit failed');
      }
    },
    [mutation],
  );

  return {
    isSubmitting: mutation.isPending,
    mutationError: mutation.isError ? 'Failed to create expense.' : null,
    submitExpense,
  };
}
