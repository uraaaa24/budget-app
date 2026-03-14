import { categoryQueryKeys } from "@/features/dashboard/model/query-keys"
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { API_PATHS } from "@repo/validation/api-paths"
import type { TransactionType } from "@/features/dashboard/model/types"

type CreateCategoryInput = {
  name: string
  emoji: string
  type: TransactionType
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  const { getToken, userId } = useAuth()

  const mutation = useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      const token = await getToken()
      if (!token) {
        throw new Error("No auth token")
      }

      const response = await fetch(`${API_BASE_URL}${API_PATHS.categories}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => "")
        throw new Error(
          detail
            ? `Failed to create category: ${response.status} ${detail}`
            : `Failed to create category: ${response.status}`,
        )
      }

      return await response.json()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...categoryQueryKeys.list(), userId],
      })
    },
  })

  const submitCategory = useCallback(
    async (input: CreateCategoryInput) => {
      await mutation.mutateAsync(input)
    },
    [mutation],
  )

  return {
    isSubmitting: mutation.isPending,
    mutationError: mutation.isError
      ? mutation.error instanceof Error
        ? mutation.error.message
        : "Failed to create category."
      : null,
    submitCategory,
  }
}
