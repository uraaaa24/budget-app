import { transactionQueryKeys } from "@/features/dashboard/model/query-keys"
import type { CreateTransactionInput } from "@/features/dashboard/model/types"
import { createTransaction } from "@/features/dashboard/services/api"
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  const { getToken, userId } = useAuth()

  const mutation = useMutation({
    mutationFn: async (input: CreateTransactionInput) => {
      const token = await getToken()
      if (!token) {
        throw new Error("No auth token")
      }

      return createTransaction(input, token)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...transactionQueryKeys.list(), userId],
      })
    },
  })

  const submitTransaction = useCallback(async (input: CreateTransactionInput) => {
    await mutation.mutateAsync(input)
  }, [mutation])

  return {
    isSubmitting: mutation.isPending,
    mutationError: mutation.isError
      ? mutation.error instanceof Error
        ? mutation.error.message
        : "Failed to create transaction."
      : null,
    submitTransaction,
  }
}
