import { transactionQueryKeys } from '@/features/dashboard/model/query-keys'
import { deleteTransaction } from '@/features/dashboard/services/api'
import { useAuth } from '@clerk/clerk-expo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()
  const { getToken, userId } = useAuth()

  const mutation = useMutation({
    mutationFn: async (transactionId: string) => {
      const token = await getToken()
      if (!token) {
        throw new Error('No auth token')
      }

      return deleteTransaction(transactionId, token)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...transactionQueryKeys.list(), userId],
      })
    },
  })

  const deleteTransactionById = useCallback(
    async (transactionId: string) => {
      await mutation.mutateAsync(transactionId)
    },
    [mutation],
  )

  return {
    isDeleting: mutation.isPending,
    deleteError: mutation.isError
      ? mutation.error instanceof Error
        ? mutation.error.message
        : 'Failed to delete transaction.'
      : null,
    deleteTransactionById,
  }
}
