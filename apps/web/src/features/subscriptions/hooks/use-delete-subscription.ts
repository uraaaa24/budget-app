import { subscriptionQueryKeys } from "@/features/subscriptions/model/query-keys"
import { deleteSubscription } from "@/features/subscriptions/services/api"
import { useAuth } from "@clerk/clerk-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient()
  const { getToken, userId } = useAuth()

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      if (!token) {
        throw new Error("No auth token")
      }

      return deleteSubscription(id, token)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...subscriptionQueryKeys.list(), userId],
      })
    },
  })

  const removeSubscription = useCallback(
    async (id: string) => {
      await mutation.mutateAsync(id)
    },
    [mutation],
  )

  return {
    isDeleting: mutation.isPending,
    deleteError: mutation.isError
      ? mutation.error instanceof Error
        ? mutation.error.message
        : "Failed to delete subscription."
      : null,
    removeSubscription,
  }
}
