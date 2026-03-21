import { ScrollArea } from "@/components/ui/scroll-area"
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

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="space-y-6">
        {groupedTransactions.map((yearGroup) => (
          <div key={yearGroup.year} className="space-y-4">
            <h3 className="text-xs font-medium text-muted-foreground">
              {yearGroup.year}年
            </h3>

            {yearGroup.months.map((monthGroup) => (
              <div
                key={`${yearGroup.year}-${monthGroup.month}`}
                className="space-y-1"
              >
                <p className="text-xs text-muted-foreground pl-1 mb-2">
                  {monthGroup.month}月
                </p>

                {monthGroup.items.map((item, index) => (
                  <button
                    key={item.id}
                    className="w-full text-left p-3 rounded-lg transition-all hover:bg-muted/30 active:bg-muted/50 animate-in fade-in slide-in-from-bottom-1 duration-300"
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => onTransactionPress?.(item)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${
                        item.type === "income"
                          ? "bg-emerald-50 dark:bg-emerald-950/30"
                          : "bg-rose-50 dark:bg-rose-950/30"
                      }`}>
                        <TwemojiEmoji
                          emoji={
                            categoryEmojiMap.get(
                              `${item.type}:${item.category.trim().toLowerCase()}`,
                            ) ?? "🏷️"
                          }
                          size={20}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {item.memo?.trim() || item.category}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(item.spentAt)}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={`text-base font-semibold tabular-nums ${
                            item.type === "income"
                              ? "text-emerald-600 dark:text-emerald-500"
                              : "text-rose-600 dark:text-rose-500"
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
            ))}
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="py-12 text-center space-y-2">
            <p className="text-sm text-foreground/80">
              さあ、今日から
            </p>
            <p className="text-xs text-muted-foreground">
              右下のボタンから始めてみましょう
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
