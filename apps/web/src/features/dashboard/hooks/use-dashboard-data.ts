import { useMonth } from "@/contexts/month-context"
import { useCategoryQuery } from "@/features/transactions/hooks/use-category-query"
import { useTransactionQuery } from "@/features/transactions/hooks/use-transaction-query"
import { useSubscriptionQuery } from "@/features/subscriptions/hooks/use-subscription-query"
import { useMemo } from "react"

export type CategoryBreakdown = {
  category: string
  amount: number
  emoji?: string
}

export type MonthlyData = {
  year: number
  month: number
  income: number
  expense: number
  balance: number
  categoryBreakdown: CategoryBreakdown[]
  topCategories: CategoryBreakdown[]
  otherCategoriesTotal: number
  dailyAverage: number
  daysInMonth: number
  currentDay: number
  previousMonthExpense: number
  expenseChange: number
  expenseChangePercentage: number
}

export const useDashboardData = () => {
  const { selectedYear, selectedMonth } = useMonth()

  const { transactions, isLoading: transactionsLoading } =
    useTransactionQuery()
  const { categories } = useCategoryQuery()
  const { summary: subscriptionSummary, isLoading: subscriptionsLoading } =
    useSubscriptionQuery()

  const monthlyData = useMemo<MonthlyData>(() => {
    // Filter transactions by selected month
    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.spentAt)
      return (
        date.getFullYear() === selectedYear &&
        date.getMonth() === selectedMonth
      )
    })

    // Calculate income and expense
    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const expense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    // Calculate previous month expense for comparison
    const previousMonth = selectedMonth === 0 ? 11 : selectedMonth - 1
    const previousYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear

    const previousMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.spentAt)
      return (
        date.getFullYear() === previousYear &&
        date.getMonth() === previousMonth
      )
    })

    const previousMonthExpense = previousMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    const expenseChange = expense - previousMonthExpense
    const expenseChangePercentage =
      previousMonthExpense > 0
        ? (expenseChange / previousMonthExpense) * 100
        : 0

    // Calculate daily average (only count elapsed days for current month)
    const today = new Date()
    const isCurrentMonth =
      selectedYear === today.getFullYear() &&
      selectedMonth === today.getMonth()

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const currentDay = isCurrentMonth ? today.getDate() : daysInMonth
    const dailyAverage = currentDay > 0 ? expense / currentDay : 0

    // Group expenses by category
    const categoryMap = new Map<string, number>()
    monthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + t.amount)
      })

    // Convert to array and sort by amount (highest first)
    const categoryBreakdown: CategoryBreakdown[] = Array.from(
      categoryMap.entries(),
    )
      .map(([category, amount]) => {
        const categoryInfo = categories.find((c) => c.name === category)
        return {
          category,
          amount,
          emoji: categoryInfo?.emoji,
        }
      })
      .sort((a, b) => b.amount - a.amount)

    // Get top 5 categories and calculate "others"
    const topCategories = categoryBreakdown.slice(0, 5)
    const otherCategoriesTotal = categoryBreakdown
      .slice(5)
      .reduce((sum, cat) => sum + cat.amount, 0)

    return {
      year: selectedYear,
      month: selectedMonth,
      income,
      expense,
      balance: income - expense,
      categoryBreakdown,
      topCategories,
      otherCategoriesTotal,
      dailyAverage,
      daysInMonth,
      currentDay,
      previousMonthExpense,
      expenseChange,
      expenseChangePercentage,
    }
  }, [transactions, categories, selectedYear, selectedMonth])

  return {
    monthlyData,
    subscriptionSummary,
    isLoading: transactionsLoading || subscriptionsLoading,
  }
}
