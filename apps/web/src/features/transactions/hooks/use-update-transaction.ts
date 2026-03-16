import { transactionQueryKeys } from "@/features/transactions/model/query-keys"
import type { UpdateTransactionInput } from "@/features/transactions/model/types"
import { updateTransaction } from "@/features/transactions/services/api"
import { useAuth } from "@clerk/clerk-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  const { getToken, userId } = useAuth()

  const mutation = useMutation({
    mutationFn: async (input: UpdateTransactionInput) => {
      const token = await getToken()
      if (!token) {
        throw new Error("No auth token")
      }

      return updateTransaction(input, token)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...transactionQueryKeys.list(), userId],
      })
    },
  })

  const submitTransaction = useCallback(
    async (input: UpdateTransactionInput) => {
      await mutation.mutateAsync(input)
    },
    [mutation]
  )

  return {
    isSubmitting: mutation.isPending,
    mutationError: mutation.isError
      ? mutation.error instanceof Error
        ? mutation.error.message
        : "Failed to update transaction."
      : null,
    submitTransaction,
  }
}
