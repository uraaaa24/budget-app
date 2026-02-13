import { useCallback, useState } from 'react';
import { createExpense } from '@/features/dashboard/api';
import type { CreateExpenseInput } from '@/features/dashboard/types';

type UseCreateExpenseParams = {
  onSuccess?: () => Promise<void> | void;
};

export function useCreateExpense({ onSuccess }: UseCreateExpenseParams = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const submitExpense = useCallback(
    async (input: CreateExpenseInput) => {
      setMutationError(null);
      setIsSubmitting(true);
      try {
        await createExpense(input);
        await onSuccess?.();
      } catch {
        setMutationError('Failed to create expense.');
        throw new Error('submit failed');
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return {
    isSubmitting,
    mutationError,
    submitExpense,
  };
}
