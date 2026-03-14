"use client"

import { TwemojiEmoji } from "@/components/ui/twemoji-emoji"
import type { Category, Transaction } from "@/features/dashboard/model/types"
import { createTransactionDateFormatter } from "@/features/dashboard/utils/transaction-date-formatter"
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
  const locale = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().locale,
    [],
  )
  const dateFormatter = useMemo(
    () => createTransactionDateFormatter(locale),
    [locale],
  )

  // Group transactions by date
  const groupedByDate = useMemo(() => {
    const dateMap = new Map<number, Transaction[]>()

    transactions.forEach((t) => {
      const dateKey = new Date(t.spentAt)
      dateKey.setHours(0, 0, 0, 0)
      const dayTimestamp = dateKey.getTime()
      const list = dateMap.get(dayTimestamp) ?? []
      list.push(t)
      dateMap.set(dayTimestamp, list)
    })

    return Array.from(dateMap.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([dayTimestamp, items]) => ({
        dayTimestamp,
        items: items.sort(
          (a, b) =>
            new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime(),
        ),
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
    <div>
      {groupedByDate.length > 0 ? (
        <div className="space-y-6">
          {groupedByDate.map((group) => {
            const relativeLabel = dateFormatter.formatRelativeDayLabel(
              group.dayTimestamp,
            )
            const absoluteLabel = dateFormatter.formatGroupDate(
              group.dayTimestamp,
            )

            return (
              <div key={group.dayTimestamp}>
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="rounded-full px-2.5 py-1 text-base font-semibold tracking-wide text-slate-700">
                    {relativeLabel ?? absoluteLabel}
                  </h3>
                </div>
                <div className="space-y-0">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onTransactionPress?.(item)}
                      className="w-full border-b border-slate-200 py-2 text-left transition-opacity hover:opacity-75"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                          <TwemojiEmoji
                            emoji={
                              categoryEmojiMap.get(
                                `${item.type}:${item.category.trim().toLowerCase()}`,
                              ) ?? "🏷️"
                            }
                            size={30}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            {item.memo?.trim() || " "}
                          </p>
                          {/* 日付を日付 + 秒までまで表示する */}
                          <p className="text-xs text-slate-500">
                            {dateFormatter.formatTransactionDateTime(
                              item.spentAt,
                            )}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <p
                            className={`text-lg font-bold ${
                              item.type === "income"
                                ? "text-emerald-600"
                                : "text-rose-600"
                            }`}
                          >
                            {item.type === "income" ? "+" : "-"}
                            {item.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-slate-500">No transactions this month.</p>
          <p className="mt-2 text-sm text-slate-400">
            Click "Add Transaction" to get started.
          </p>
        </div>
      )}
    </div>
  )
}
