import { subscriptionQueryKeys } from "@/features/subscriptions/model/query-keys"
import { fetchSubscriptions } from "@/features/subscriptions/services/api"
import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"

export const useSubscriptionQuery = () => {
  const { getToken, userId } = useAuth()

  const query = useQuery({
    queryKey: [...subscriptionQueryKeys.list(), userId],
    queryFn: async () => {
      const token = await getToken()
      if (!token) {
        throw new Error("No auth token")
      }
      return fetchSubscriptions(token)
    },
    enabled: !!userId,
  })

  return {
    subscriptions: query.data?.items ?? [],
    summary: query.data?.summary ?? {
      activeCount: 0,
      pausedCount: 0,
      canceledCount: 0,
      monthlyTotal: 0,
      yearlyTotal: 0,
    },
    isLoading: query.isLoading,
    queryError: query.error,
  }
}
