"use client"

import { TwemojiEmoji } from "@/components/ui/twemoji-emoji"
import type { Category, Transaction } from "@/features/dashboard/model/types"
import { useMemo } from "react"

type TransactionListProps = {
  categories: Category[]
  transactions: Transaction[]
  onTransactionPress?: (transaction: Transaction) => void
}

export function TransactionList({
  categories,
  transactions,
  onTransactionPress,
}: TransactionListProps) {
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })

  const groupedTransactions = useMemo(() => {
    const yearMap = new Map<number, Map<number, Transaction[]>>()
    for (const item of transactions) {
      const date = new Date(item.spentAt)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const monthMap = yearMap.get(year) ?? new Map<number, Transaction[]>()
      const list = monthMap.get(month) ?? []
      list.push(item)
      monthMap.set(month, list)
      yearMap.set(year, monthMap)
    }

    return Array.from(yearMap.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, monthMap]) => ({
        year,
        months: Array.from(monthMap.entries())
          .sort((a, b) => b[0] - a[0])
          .map(([month, items]) => ({ month, items })),
      }))
  }, [transactions])

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

  return (
    <div className="space-y-3">
      {groupedTransactions.map((yearGroup) => (
        <div key={yearGroup.year}>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            {yearGroup.year}
          </h3>
          {yearGroup.months.map((monthGroup) => (
            <div key={`${yearGroup.year}-${monthGroup.month}`} className="mb-3">
              <h4 className="mb-2 text-xs font-medium text-slate-500">
                {monthGroup.month}月
              </h4>
              {monthGroup.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTransactionPress?.(item)}
                  className="mb-2 flex w-full items-stretch gap-3 rounded-xl border-b border-slate-200 bg-white p-3 text-left hover:bg-slate-50"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100">
                    <TwemojiEmoji
                      emoji={
                        categoryEmojiMap.get(
                          `${item.type}:${item.category.trim().toLowerCase()}`,
                        ) ?? "🏷️"
                      }
                      size={32}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-0.5">
                    <p className="text-sm text-slate-500">
                      {formatDate(item.spentAt)}
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {item.memo?.trim() || "No memo"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p
                      className={`text-base font-semibold ${
                        item.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"}
                      {item.amount.toFixed(0)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      ))}
      {transactions.length === 0 && (
        <p className="text-slate-500">No transactions yet.</p>
      )}
    </div>
  )
}
