import type { Transaction } from "@/features/dashboard/model/types"
import { Text, View } from "react-native"

type TransactionListProps = {
  transactions: Transaction[]
  income: number
  expense: number
  balance: number
}

export const TransactionList = ({
  transactions,
  income,
  expense,
  balance,
}: TransactionListProps) => {
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
            <Text className="font-semibold text-slate-900">
              [{item.type === "income" ? "IN" : "OUT"}] {item.category} -{" "}
              {item.amount}
            </Text>
            {item.memo ? (
              <Text className="text-slate-600">{item.memo}</Text>
            ) : null}
            <Text className="text-xs text-slate-500">
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
