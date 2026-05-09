import { categoryQueryKeys } from "@/features/transactions/model/query-keys"
import { fetchCategories } from "@/features/transactions/services/api"
import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export const useCategoryQuery = () => {
  const { isSignedIn, userId, getToken } = useAuth()

  const { data, isError, isLoading } = useQuery({
    queryKey: [...categoryQueryKeys.list(), userId],
    enabled: Boolean(isSignedIn),
    staleTime: 1000 * 60 * 10, // 10分間はキャッシュを新鮮とみなす（マスターデータ的な性質のため）
    queryFn: async () => {
      const token = await getToken()
      if (!token) {
        throw new Error("No auth token")
      }

      return fetchCategories(token)
    },
  })

  const categories = useMemo(() => data ?? [], [data])

  return {
    categories,
    isLoading,
    queryError: isError ? "Failed to load categories." : null,
  }
}
