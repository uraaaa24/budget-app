import { Pressable, Text, TextInput, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import type { CreateExpenseInput, ExpenseFormValues } from '@/features/dashboard/types';

type ExpenseFormProps = {
  isSubmitting: boolean;
  onSubmit: (input: CreateExpenseInput) => Promise<void>;
};

export function ExpenseForm({ isSubmitting, onSubmit }: ExpenseFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormValues>({
    defaultValues: {
      amount: '',
      category: '',
      memo: '',
    },
  });

  const submit = async (values: ExpenseFormValues) => {
    const parsedAmount = Number(values.amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    try {
      await onSubmit({
        amount: parsedAmount,
        category: values.category.trim(),
        memo: values.memo.trim() || undefined,
        spentAt: new Date().toISOString(),
      });
      reset();
    } catch {
      // parent hook owns error state
    }
  };

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="mb-4 text-lg font-semibold text-slate-900">Record Expense</Text>

      <Text className="mb-1 text-slate-700">Amount</Text>
      <Controller
        control={control}
        name="amount"
        rules={{
          required: 'Amount is required.',
          validate: (value: string) =>
            Number.isFinite(Number(value)) && Number(value) > 0
              ? true
              : 'Amount must be a positive number.',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="decimal-pad"
            placeholder="1200"
            className="mb-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900"
          />
        )}
      />
      {errors.amount ? <Text className="mb-3 text-rose-600">{errors.amount.message}</Text> : null}

      <Text className="mb-1 text-slate-700">Category</Text>
      <Controller
        control={control}
        name="category"
        rules={{
          required: 'Category is required.',
          maxLength: {
            value: 50,
            message: 'Category must be 50 characters or less.',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Food"
            className="mb-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900"
          />
        )}
      />
      {errors.category ? <Text className="mb-3 text-rose-600">{errors.category.message}</Text> : null}

      <Text className="mb-1 text-slate-700">Memo (optional)</Text>
      <Controller
        control={control}
        name="memo"
        rules={{
          maxLength: {
            value: 200,
            message: 'Memo must be 200 characters or less.',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Lunch with team"
            className="mb-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900"
          />
        )}
      />
      {errors.memo ? <Text className="mb-3 text-rose-600">{errors.memo.message}</Text> : null}

      <Pressable
        onPress={handleSubmit(submit)}
        disabled={isSubmitting}
        className="rounded-xl bg-slate-900 px-4 py-3">
        <Text className="text-center font-semibold text-white">
          {isSubmitting ? 'Saving...' : 'Save Expense'}
        </Text>
      </Pressable>
    </View>
  );
}
