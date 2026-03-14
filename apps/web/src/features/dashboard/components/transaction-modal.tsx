"use client"

import { TransactionForm } from "./transaction-form/transaction-form"
import { useCreateTransaction } from "@/features/dashboard/hooks/use-create-transaction"
import { useUpdateTransaction } from "@/features/dashboard/hooks/use-update-transaction"
import type {
  Category,
  CreateTransactionInput,
  Transaction,
} from "@/features/dashboard/model/types"

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-lg rounded-t-3xl bg-slate-50 p-6 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="font-medium text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        {mutationError && (
          <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
            <p className="text-rose-700">{mutationError}</p>
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
  )
}
