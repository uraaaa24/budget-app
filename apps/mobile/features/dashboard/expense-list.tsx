import { Text, View } from 'react-native';
import type { Expense } from '@/features/dashboard/types';

type ExpenseListProps = {
  expenses: Expense[];
  totalAmount: number;
};

export function ExpenseList({ expenses, totalAmount }: ExpenseListProps) {
  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="text-lg font-semibold text-slate-900">Recent Expenses</Text>
      <Text className="mt-1 text-slate-600">Total: {totalAmount.toFixed(0)}</Text>

      <View className="mt-4 gap-2">
        {expenses.map((item) => (
          <View key={item.id} className="rounded-xl border border-slate-200 p-3">
            <Text className="font-semibold text-slate-900">
              {item.category} - {item.amount}
            </Text>
            {item.memo ? <Text className="text-slate-600">{item.memo}</Text> : null}
            <Text className="text-xs text-slate-500">{new Date(item.spentAt).toLocaleString()}</Text>
          </View>
        ))}

        {expenses.length === 0 ? <Text className="text-slate-500">No expenses yet.</Text> : null}
      </View>
    </View>
  );
}
