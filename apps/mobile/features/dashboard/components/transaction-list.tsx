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
  const categoryEmojiMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const category of categories) {
      map.set(`${category.type}:${category.name.trim().toLowerCase()}`, category.emoji)
    }
    return map
  }, [categories])

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="text-lg font-semibold text-slate-900">
        Recent Transactions
      </Text>
      <Text className="mt-1 text-slate-600">
        Income: {income.toFixed(0)} / Expense: {expense.toFixed(0)} / Balance:{" "}
        {balance.toFixed(0)}
      </Text>

      <View className="mt-4 gap-2">
        {transactions.map((item) => (
          <View
            key={item.id}
            className="rounded-xl border border-slate-200 p-3"
          >
            <View className="flex-row items-center justify-between">
              <View className="rounded-full bg-slate-100 px-3 py-1">
                <Text className="text-base">
                  {categoryEmojiMap.get(
                    `${item.type}:${item.category.trim().toLowerCase()}`,
                  ) ?? "🏷️"}
                </Text>
              </View>
              <Text className="font-semibold text-slate-900">{item.amount}</Text>
            </View>
            {item.memo ? (
              <Text className="mt-2 text-slate-600">{item.memo}</Text>
            ) : null}
            <Text className="mt-1 text-xs text-slate-500">
              {new Date(item.spentAt).toLocaleString()}
            </Text>
          </View>
        ))}

        {transactions.length === 0 ? (
          <Text className="text-slate-500">No transactions yet.</Text>
        ) : null}
      </View>
    </View>
  )
}
