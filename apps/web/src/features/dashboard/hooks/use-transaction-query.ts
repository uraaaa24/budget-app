import { transactionQueryKeys } from "@/features/dashboard/model/query-keys"
import { fetchTransactions } from "@/features/dashboard/services/api"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export const useTransactionQuery = () => {
  const { isSignedIn, userId, getToken } = useAuth()

  const { data, isError } = useQuery({
    queryKey: [...transactionQueryKeys.list(), userId],
    enabled: Boolean(isSignedIn),
    queryFn: async () => {
      const token = await getToken()
      if (!token) {
        throw new Error("No auth token")
      }

      return fetchTransactions(token)
    },
  })

  const transactions = useMemo(() => data ?? [], [data])

  const summary = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((total, item) => total + item.amount, 0)
    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((total, item) => total + item.amount, 0)

    return {
      income,
      expense,
      balance: income - expense,
    }
  }, [transactions])

  return {
    transactions,
    summary,
    queryError: isError ? "Failed to load transactions." : null,
  }
}
