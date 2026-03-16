import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CategoryPicker } from "@/features/transactions/components/transaction-form/category-picker"
import { DatePicker } from "@/features/transactions/components/transaction-form/date-picker"
import { TypeSelector } from "@/features/transactions/components/transaction-form/type-selector"
import { transactionFormSchema } from "@/features/transactions/model/schemas"
import type {
  Category,
  CreateTransactionInput,
  TransactionFormValues,
} from "@/features/transactions/model/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"

type TransactionFormProps = {
  categories: Category[]
  isSubmitting: boolean
  onSubmit: (input: CreateTransactionInput) => Promise<void>
  onSuccess?: () => void
  initialValues?: TransactionFormValues & { id?: string; spentAt?: string }
}

export const TransactionForm = ({
  categories,
  isSubmitting,
  onSubmit,
  onSuccess,
  initialValues,
}: TransactionFormProps) => {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          spentAt: initialValues.spentAt
            ? new Date(initialValues.spentAt)
            : new Date(),
        }
      : {
          type: "expense",
          amount: "",
          category: "",
          memo: "",
          spentAt: new Date(),
        },
  })

  const selectedType = form.watch("type")
  const selectedCategory = form.watch("category")

  const availableCategories = useMemo(
    () => categories.filter((item) => item.type === selectedType),
    [categories, selectedType]
  )

  useEffect(() => {
    const isSelectedAvailable = availableCategories.some(
      (item) => item.name === selectedCategory
    )
    if (isSelectedAvailable) {
      return
    }

    const nextCategory = availableCategories[0]?.name ?? ""
    if (nextCategory === selectedCategory) {
      return
    }

    form.setValue("category", nextCategory, { shouldValidate: true })
  }, [availableCategories, selectedCategory, form])

  const handleSubmit = async (values: TransactionFormValues) => {
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
        spentAt: values.spentAt.toISOString(),
      })
      form.reset({
        type: values.type,
        amount: "",
        category: "",
        memo: "",
        spentAt: new Date(),
      })
      onSuccess?.()
    } catch {
      // parent hook owns error state
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <TypeSelector
                selectedType={field.value}
                onSelect={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="1200"
                  inputMode="decimal"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <CategoryPicker
                selectedCategory={field.value}
                availableCategories={availableCategories}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="spentAt"
          render={({ field }) => (
            <FormItem>
              <DatePicker value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memo (optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Lunch with team" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Transaction"}
        </Button>
      </form>
    </Form>
  )
}
