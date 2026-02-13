import { ScrollView, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { ExpenseForm } from '@/features/dashboard/components/expense-form';
import { ExpenseList } from '@/features/dashboard/components/expense-list';
import { useCreateExpense } from '@/features/dashboard/hooks/use-create-expense';
import { useExpenseQuery } from '@/features/dashboard/hooks/use-expense-query';

export function DashboardScreen() {
  const { expenses, totalAmount, queryError } = useExpenseQuery();
  const { isSubmitting, mutationError, submitExpense } = useCreateExpense();

  const error = mutationError ?? queryError;

  return (
    <ScreenContainer>
      <View className="mb-6">
        <Text className="text-3xl font-bold text-slate-900">Budget App</Text>
        <Text className="mt-2 text-slate-600">Sample: create an expense from this form.</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32, gap: 16 }}>
        <ExpenseForm isSubmitting={isSubmitting} onSubmit={submitExpense} />

        {error ? (
          <View className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <Text className="text-rose-700">{error}</Text>
          </View>
        ) : null}

        <ExpenseList expenses={expenses} totalAmount={totalAmount} />
      </ScrollView>
    </ScreenContainer>
  );
}
