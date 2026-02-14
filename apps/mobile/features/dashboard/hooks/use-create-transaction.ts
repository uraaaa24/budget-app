import { useCallback } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionQueryKeys } from '@/features/dashboard/model/query-keys'
import type { CreateTransactionInput } from '@/features/dashboard/model/types'
import { createTransaction } from '@/features/dashboard/services/api'

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  const { getToken, userId } = useAuth()

  const mutation = useMutation({
    mutationFn: async (input: CreateTransactionInput) => {
      const token = await getToken()
      if (!token) {
        throw new Error('No auth token')
      }

      return createTransaction(input, token)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...transactionQueryKeys.list(), userId],
      })
    },
  })

  const submitTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      try {
        await mutation.mutateAsync(input)
      } catch {
        throw new Error('submit failed')
      }
    },
    [mutation],
  )

  return {
    isSubmitting: mutation.isPending,
    mutationError: mutation.isError ? 'Failed to create transaction.' : null,
    submitTransaction,
  }
}
