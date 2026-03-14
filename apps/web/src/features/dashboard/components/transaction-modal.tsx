"use client"

import { useCreateTransaction } from "@/features/dashboard/hooks/use-create-transaction"
import { useUpdateTransaction } from "@/features/dashboard/hooks/use-update-transaction"
import type {
  Category,
  CreateTransactionInput,
  Transaction,
} from "@/features/dashboard/model/types"
import { TransactionForm } from "./transaction-form/transaction-form"

type TransactionModalProps = {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  transaction?: Transaction | null
}

export function TransactionModal({
  isOpen,
  onClose,
  categories,
  transaction,
}: TransactionModalProps) {
  const toDateInputValue = (isoDate: string): string => {
    const date = new Date(isoDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const {
    isSubmitting: isCreating,
    mutationError: createError,
    submitTransaction: createTransaction,
  } = useCreateTransaction()
  const {
    isSubmitting: isUpdating,
    mutationError: updateError,
    submitTransaction: updateTransaction,
  } = useUpdateTransaction()

  const isSubmitting = isCreating || isUpdating
  const mutationError = createError || updateError

  const handleSubmit = async (input: CreateTransactionInput) => {
    if (transaction?.id) {
      await updateTransaction({ ...input, id: transaction.id })
    } else {
      await createTransaction(input)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-lg overflow-hidden bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {transaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <button
              onClick={onClose}
              className="text-sm font-medium text-slate-600 transition-opacity hover:opacity-75"
            >
              Close
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          {mutationError && (
            <div className="mb-4 border-l-4 border-rose-500 bg-rose-50 p-4">
              <p className="text-sm text-rose-700">{mutationError}</p>
            </div>
          )}

          <TransactionForm
            categories={categories}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            initialValues={
              transaction
                ? {
                    id: transaction.id,
                    type: transaction.type,
                    date: toDateInputValue(transaction.spentAt),
                    amount: transaction.amount.toString(),
                    category: transaction.category,
                    memo: transaction.memo ?? "",
                    spentAt: transaction.spentAt,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  )
}
