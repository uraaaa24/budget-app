import { categoryQueryKeys } from '@/features/dashboard/model/query-keys'
import { fetchCategories } from '@/features/dashboard/services/api'
import { useAuth } from '@clerk/clerk-expo'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useCategoryQuery = () => {
  const { isSignedIn, userId, getToken } = useAuth()

  const { data, isError } = useQuery({
    queryKey: [...categoryQueryKeys.list(), userId],
    enabled: Boolean(isSignedIn),
    queryFn: async () => {
      const token = await getToken()
      if (!token) {
        throw new Error('No auth token')
      }

      return fetchCategories(token)
    },
  })

  const categories = useMemo(() => data ?? [], [data])

  return {
    categories,
    queryError: isError ? 'Failed to load categories.' : null,
  }
}
