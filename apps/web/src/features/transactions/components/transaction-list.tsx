import { TwemojiEmoji } from "@/components/ui/twemoji-emoji"
import type { Category, Transaction } from "@/features/transactions/model/types"
import { format } from "date-fns"
import { useMemo } from "react"

type TransactionListProps = {
  categories: Category[]
  transactions: Transaction[]
  onTransactionPress?: (transaction: Transaction) => void
}

export const TransactionList = ({
  categories,
  transactions,
  onTransactionPress,
}: TransactionListProps) => {
  const formatDate = (value: string) => {
    const date = new Date(value)
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
  }

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
          .map(([month, items]) => ({
            month,
            items,
          })),
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

  if (transactions.length === 0) {
    return (
      <div className="py-16 text-center space-y-2">
        <p className="text-base text-foreground/70">さあ、今日から</p>
        <p className="text-sm text-muted-foreground">
          右下のボタンから始めてみましょう
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {groupedTransactions.map((yearGroup) => (
        <div key={yearGroup.year} className="space-y-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            {yearGroup.year}年
          </h3>

          {yearGroup.months.map((monthGroup) => (
            <div
              key={`${yearGroup.year}-${monthGroup.month}`}
              className="space-y-3"
            >
              <p className="text-sm text-muted-foreground px-1">
                {monthGroup.month}月
              </p>

              <div className="divide-y divide-border">
                {monthGroup.items.map((item) => (
                  <button
                    key={item.id}
                    className="w-full text-left px-3 py-3 transition-colors hover:bg-accent/50 active:bg-accent"
                    onClick={() => onTransactionPress?.(item)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Emoji - Simple, no decorative circle */}
                      <div className="shrink-0">
                        <TwemojiEmoji
                          emoji={
                            categoryEmojiMap.get(
                              `${item.type}:${item.category.trim().toLowerCase()}`,
                            ) ?? "🏷️"
                          }
                          size={30}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-base font-medium text-foreground line-clamp-1">
                          {item.memo?.trim() || item.category}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(item.spentAt)}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="text-right shrink-0">
                        <p
                          className={`text-lg font-semibold tabular-nums ${
                            item.type === "income"
                              ? "text-[color:var(--income)]"
                              : "text-[color:var(--expense)]"
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
          ))}
        </div>
      ))}
    </div>
  )
}
