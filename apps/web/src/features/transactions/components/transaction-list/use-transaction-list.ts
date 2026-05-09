import type { Transaction } from "@/features/transactions/model/types"
import { format } from "date-fns"
import { useCallback, useMemo } from "react"
import { useCategoryQuery } from "../../hooks/use-category-query"

export type TransactionWithEmoji = Transaction & {
  emoji: string
}

type GroupedTransaction = {
  dateLabel: string
  items: TransactionWithEmoji[]
}

/**
 * Custom hook to process and group transactions for display in the transaction list.
 */
export const useTransactionList = (transactions: Transaction[]) => {
  const { categories } = useCategoryQuery()

  /**
   * Get a human-friendly label for a given date.
   */
  const getDateLabel = useCallback((date: Date): string => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "今日"
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "昨日"
    }
    return format(date, "M/d")
  }, [])

  /**
   * Create a mapping of "type:category" to emoji for quick lookup when rendering transactions.
   */
  const categoryEmojiMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const category of categories) {
      map.set(
        `${category.type}:${category.name.trim().toLowerCase()}`,
        category.emoji,
      )
    }
    return map
  }, [categories])

  /**
   * Group transactions by date and enrich them with emojis based on their category and type.
   * Transactions are sorted by date in descending order (newest first) within each group.
   */
  const groupedTransactions = useMemo<GroupedTransaction[]>(() => {
    const dateMap = new Map<string, TransactionWithEmoji[]>()

    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime(),
    )

    for (const item of sortedTransactions) {
      const date = new Date(item.spentAt)
      const dateLabel = getDateLabel(date)

      // Add emoji to transaction
      const emoji =
        categoryEmojiMap.get(
          `${item.type}:${item.category.trim().toLowerCase()}`,
        ) ?? "🏷️"

      const list = dateMap.get(dateLabel) ?? []
      list.push({ ...item, emoji })
      dateMap.set(dateLabel, list)
    }

    return Array.from(dateMap.entries()).map(([dateLabel, items]) => ({
      dateLabel,
      items,
    }))
  }, [transactions, categoryEmojiMap, getDateLabel])

  return {
    groupedTransactions,
  }
}
