import { Card } from "@/components/ui/card"
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
  const formatDate = (value: string) =>
    format(new Date(value), "yyyy/MM/dd")

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
        category.emoji
      )
    }
    return map
  }, [categories])

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-6 p-4">
        {groupedTransactions.map((yearGroup) => (
          <div key={yearGroup.year} className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              {yearGroup.year}
            </h3>

            {yearGroup.months.map((monthGroup) => (
              <div key={`${yearGroup.year}-${monthGroup.month}`} className="space-y-2">
                <p className="text-xs font-medium text-slate-500">
                  {monthGroup.month}月
                </p>

                {monthGroup.items.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer p-3 transition-colors hover:bg-slate-50"
                    onClick={() => onTransactionPress?.(item)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                        <TwemojiEmoji
                          emoji={
                            categoryEmojiMap.get(
                              `${item.type}:${item.category.trim().toLowerCase()}`
                            ) ?? "🏷️"
                          }
                          size={24}
                        />
                      </div>

                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm text-slate-500">
                          {formatDate(item.spentAt)}
                        </p>
                        <p className="text-sm font-medium text-slate-900 line-clamp-1">
                          {item.memo?.trim() || "No memo"}
                        </p>
                      </div>

                      <div className="text-right">
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
                    </div>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="text-center text-slate-500">No transactions yet.</p>
        )}
      </div>
    </ScrollArea>
  )
}
