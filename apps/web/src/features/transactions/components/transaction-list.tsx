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
  // Group transactions by date (M/d format)
  const groupedTransactions = useMemo(() => {
    const dateMap = new Map<string, Transaction[]>()

    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime(),
    )

    for (const item of sortedTransactions) {
      const date = new Date(item.spentAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let dateLabel: string
      if (date.toDateString() === today.toDateString()) {
        dateLabel = "今日"
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateLabel = "昨日"
      } else {
        dateLabel = format(date, "M/d")
      }

      const list = dateMap.get(dateLabel) ?? []
      list.push(item)
      dateMap.set(dateLabel, list)
    }

    return Array.from(dateMap.entries()).map(([dateLabel, items]) => ({
      dateLabel,
      items,
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
    <div className="space-y-6">
      {groupedTransactions.map((group) => (
        <div key={group.dateLabel} className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground px-1">
            {group.dateLabel}
          </p>

          <div className="space-y-2">
            {group.items.map((item) => {
              const hasMemo = Boolean(item.memo?.trim())
              const isIncome = item.type === "income"

              return (
                <button
                  key={item.id}
                  className="w-full text-left rounded-xl bg-accent/30 hover:bg-accent/50 active:bg-accent transition-colors px-4 py-3.5"
                  onClick={() => onTransactionPress?.(item)}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="shrink-0">
                      <TwemojiEmoji
                        emoji={
                          categoryEmojiMap.get(
                            `${item.type}:${item.category.trim().toLowerCase()}`,
                          ) ?? "🏷️"
                        }
                        size={28}
                      />
                    </div>

                    {hasMemo ? (
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-base font-medium text-foreground line-clamp-1 leading-tight">
                          {item.category}
                        </p>
                        <p className="text-xs text-muted-foreground/80 leading-none">
                          {item.memo}
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0 flex items-center h-10">
                        <p className="text-base font-medium text-foreground line-clamp-1">
                          {item.category}
                        </p>
                      </div>
                    )}

                    <div className="text-right shrink-0">
                      <p
                        className={`text-lg font-semibold tabular-nums ${
                          isIncome ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isIncome ? "+" : ""}¥{item.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
