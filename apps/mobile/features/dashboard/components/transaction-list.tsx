import { TwemojiEmoji } from "@/components/ui/twemoji-emoji"
import type { Category, Transaction } from "@/features/dashboard/model/types"
import { useMemo } from "react"
import { Text, View } from "react-native"

type TransactionListProps = {
  categories: Category[]
  transactions: Transaction[]
  income: number
  expense: number
  balance: number
}

export const TransactionList = ({
  categories,
  transactions,
  income,
  expense,
  balance,
}: TransactionListProps) => {
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
    <View className="p-4">
      <View className="mt-4">
        {groupedTransactions.map((yearGroup) => (
          <View key={yearGroup.year} className="mb-3">
            <Text className="mb-1 text-sm font-semibold text-slate-900">
              {yearGroup.year}
            </Text>

            {yearGroup.months.map((monthGroup) => (
              <View
                key={`${yearGroup.year}-${monthGroup.month}`}
                className="mb-2"
              >
                <Text className="mb-1 text-xs font-medium text-slate-500">
                  {monthGroup.month}月
                </Text>

                {monthGroup.items.map((item) => (
                  <View
                    key={item.id}
                    className="mb-2 rounded-xl border-b border-slate-200 p-3"
                  >
                    <View className="min-h-10 flex-row items-stretch gap-3">
                      <View className="h-16 w-16 items-center justify-center rounded-lg bg-white">
                        {/* emoji */}
                        <TwemojiEmoji
                          emoji={
                            categoryEmojiMap.get(
                              `${item.type}:${item.category.trim().toLowerCase()}`,
                            ) ?? "🏷️"
                          }
                          size={32}
                        />
                      </View>

                      <View className="flex-1 justify-center gap-0.5">
                        {/* date */}
                        <Text className="text-sm text-slate-500">
                          {formatDate(item.spentAt)}
                        </Text>
                        {/* memo */}
                        <Text
                          numberOfLines={1}
                          className="text-sm font-medium text-slate-900"
                        >
                          {item.memo?.trim() || "No memo"}
                        </Text>
                      </View>

                      <View className="items-end justify-center">
                        {/* amount */}
                        <Text
                          className={`text-base font-semibold ${
                            item.type === "income"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {item.type === "income" ? "+" : "-"}
                          {item.amount.toFixed(0)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}

        {transactions.length === 0 ? (
          <Text className="text-slate-500">No transactions yet.</Text>
        ) : null}
      </View>
    </View>
  )
}
