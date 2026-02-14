import type {
  CreateTransactionInput,
  TransactionFormValues,
  TransactionType,
} from "@/features/dashboard/model/types"
import { Controller, useForm } from "react-hook-form"
import { Pressable, Text, TextInput, View } from "react-native"

type TransactionFormProps = {
  isSubmitting: boolean
  onSubmit: (input: CreateTransactionInput) => Promise<void>
}

const typeOptions: { value: TransactionType; label: string }[] = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
]

export function TransactionForm({
  isSubmitting,
  onSubmit,
}: TransactionFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<TransactionFormValues>({
    defaultValues: {
      type: "expense",
      amount: "",
      category: "",
      memo: "",
    },
  })

  const selectedType = watch("type")

  const submit = async (values: TransactionFormValues) => {
    const parsedAmount = Number(values.amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }

    try {
      await onSubmit({
        type: values.type,
        amount: parsedAmount,
        category: values.category.trim(),
        memo: values.memo.trim() || undefined,
        spentAt: new Date().toISOString(),
      })
      reset({
        type: values.type,
        amount: "",
        category: "",
        memo: "",
      })
    } catch {
      // parent hook owns error state
    }
  }

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="mb-4 text-lg font-semibold text-slate-900">
        Record Transaction
      </Text>

      <Text className="mb-1 text-slate-700">Type</Text>
      <Controller
        control={control}
        name="type"
        rules={{ required: "Type is required." }}
        render={({ field: { onChange } }) => (
          <View className="mb-3 flex-row gap-2">
            {typeOptions.map((option) => {
              const isSelected = selectedType === option.value
              return (
                <Pressable
                  key={option.value}
                  onPress={() => onChange(option.value)}
                  className={`rounded-xl px-3 py-2 ${isSelected ? "bg-slate-900" : "bg-slate-100"}`}
                >
                  <Text
                    className={
                      isSelected ? "font-semibold text-white" : "text-slate-700"
                    }
                  >
                    {option.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        )}
      />

      <Text className="mb-1 text-slate-700">Amount</Text>
      <Controller
        control={control}
        name="amount"
        rules={{
          required: "Amount is required.",
          validate: (value: string) =>
            Number.isFinite(Number(value)) && Number(value) > 0
              ? true
              : "Amount must be a positive number.",
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
      {errors.amount ? (
        <Text className="mb-3 text-rose-600">{errors.amount.message}</Text>
      ) : null}

      <Text className="mb-1 text-slate-700">Category</Text>
      <Controller
        control={control}
        name="category"
        rules={{
          required: "Category is required.",
          maxLength: {
            value: 50,
            message: "Category must be 50 characters or less.",
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
      {errors.category ? (
        <Text className="mb-3 text-rose-600">{errors.category.message}</Text>
      ) : null}

      <Text className="mb-1 text-slate-700">Memo (optional)</Text>
      <Controller
        control={control}
        name="memo"
        rules={{
          maxLength: {
            value: 200,
            message: "Memo must be 200 characters or less.",
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
      {errors.memo ? (
        <Text className="mb-3 text-rose-600">{errors.memo.message}</Text>
      ) : null}

      <Pressable
        onPress={handleSubmit(submit)}
        disabled={isSubmitting}
        className="rounded-xl bg-slate-900 px-4 py-3"
      >
        <Text className="text-center font-semibold text-white">
          {isSubmitting ? "Saving..." : "Save Transaction"}
        </Text>
      </Pressable>
    </View>
  )
}
