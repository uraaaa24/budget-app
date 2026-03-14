import { CategoryPicker } from "@/features/dashboard/components/transaction-form/category-picker"
import { TextInputField } from "@/features/dashboard/components/transaction-form/text-input-field"
import { TypeSelector } from "@/features/dashboard/components/transaction-form/type-selector"
import type {
  Category,
  CreateTransactionInput,
  TransactionFormValues,
} from "@/features/dashboard/model/types"
import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

const formatDateInputValue = (value: Date): string => {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const buildSpentAt = (dateValue: string): string => {
  const now = new Date()
  const [yearText, monthText, dayText] = dateValue.split("-")
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const merged = new Date(
    Number.isFinite(year) ? year : now.getFullYear(),
    Number.isFinite(month) ? month - 1 : now.getMonth(),
    Number.isFinite(day) ? day : now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  )
  return merged.toISOString()
}

type TransactionFormProps = {
  categories: Category[]
  isSubmitting: boolean
  onSubmit: (input: CreateTransactionInput) => Promise<void>
  initialValues?: TransactionFormValues & { id?: string; spentAt?: string }
}

export const TransactionForm = ({
  categories,
  isSubmitting,
  onSubmit,
  initialValues,
}: TransactionFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TransactionFormValues>({
    defaultValues: initialValues ?? {
      type: "expense",
      date: formatDateInputValue(new Date()),
      amount: "",
      category: "",
      memo: "",
    },
  })

  const selectedType = watch("type")
  const selectedCategory = watch("category")
  const availableCategories = useMemo(
    () => categories.filter((item) => item.type === selectedType),
    [categories, selectedType],
  )

  useEffect(() => {
    const isSelectedAvailable = availableCategories.some(
      (item) => item.name === selectedCategory,
    )
    if (isSelectedAvailable) {
      return
    }

    const nextCategory = availableCategories[0]?.name ?? ""
    if (nextCategory === selectedCategory) {
      return
    }

    setValue("category", nextCategory, { shouldValidate: true })
  }, [availableCategories, selectedCategory, setValue])

  const submit = async (values: TransactionFormValues) => {
    const parsedAmount = Number(values.amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }

    try {
      await onSubmit({
        type: values.type,
        amount: parsedAmount,
        category: values.category,
        memo: values.memo.trim() || undefined,
        spentAt: buildSpentAt(values.date),
      })
      reset({
        type: values.type,
        date: formatDateInputValue(new Date()),
        amount: "",
        category: "",
        memo: "",
      })
    } catch {
      // parent hook owns error state
    }
  }

  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name="type"
        rules={{ required: "Type is required." }}
        render={({ field: { onChange } }) => (
          <TypeSelector selectedType={selectedType} onSelect={onChange} />
        )}
      />
      {errors.type?.message && (
        <p className="mb-3 text-rose-600">{errors.type.message}</p>
      )}

      <Controller
        control={control}
        name="date"
        rules={{ required: "Date is required." }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputField
            label="Date"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            type="date"
            placeholder="YYYY-MM-DD"
            errorMessage={errors.date?.message}
          />
        )}
      />

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
          <TextInputField
            label="Amount"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            type="number"
            placeholder="1200"
            errorMessage={errors.amount?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="category"
        rules={{
          required: "Category is required.",
        }}
        render={({ field: { onChange } }) => (
          <CategoryPicker
            selectedCategory={selectedCategory}
            availableCategories={availableCategories}
            onChange={onChange}
            errorMessage={errors.category?.message}
          />
        )}
      />

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
          <TextInputField
            label="Memo (optional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Lunch with team"
            errorMessage={errors.memo?.message}
          />
        )}
      />

      <button
        onClick={handleSubmit(submit)}
        disabled={isSubmitting}
        className="h-12 w-full rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-opacity hover:opacity-75 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Transaction"}
      </button>
    </div>
  )
}
