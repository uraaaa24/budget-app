import { subscriptionQueryKeys } from "@/features/subscriptions/model/query-keys"
import type { UpdateSubscriptionInput } from "@/features/subscriptions/model/types"
import { updateSubscription } from "@/features/subscriptions/services/api"
import { useAuth } from "@clerk/clerk-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient()
  const { getToken, userId } = useAuth()

  const mutation = useMutation({
    mutationFn: async (input: UpdateSubscriptionInput) => {
      const token = await getToken()
      if (!token) {
        throw new Error("No auth token")
      }

      return updateSubscription(input, token)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...subscriptionQueryKeys.list(), userId],
      })
    },
  })

  const submitSubscription = useCallback(
    async (input: UpdateSubscriptionInput) => {
      await mutation.mutateAsync(input)
    },
    [mutation],
  )

  return {
    isSubmitting: mutation.isPending,
    mutationError: mutation.isError
      ? mutation.error instanceof Error
        ? mutation.error.message
        : "Failed to update subscription."
      : null,
    submitSubscription,
  }
}
