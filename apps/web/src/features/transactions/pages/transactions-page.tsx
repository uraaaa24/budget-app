import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { TransactionForm } from "@/features/transactions/components/transaction-form"
import { TransactionList } from "@/features/transactions/components/transaction-list"
import { useCategoryQuery } from "@/features/transactions/hooks/use-category-query"
import { useCreateTransaction } from "@/features/transactions/hooks/use-create-transaction"
import { useTransactionQuery } from "@/features/transactions/hooks/use-transaction-query"
import { useUpdateTransaction } from "@/features/transactions/hooks/use-update-transaction"
import type { Transaction } from "@/features/transactions/model/types"
import { useAuth } from "@clerk/clerk-react"
import { Plus } from "lucide-react"
import { useState } from "react"

export const TransactionsPage = () => {
  const { userId } = useAuth()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const { categories, queryError: categoryQueryError } = useCategoryQuery()
  const { transactions, summary, queryError } = useTransactionQuery()
  const { isSubmitting: isCreating, submitTransaction: createTransaction } =
    useCreateTransaction()
  const { isSubmitting: isUpdating, submitTransaction: updateTransaction } =
    useUpdateTransaction()

  const error = queryError ?? categoryQueryError

  const handleTransactionPress = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsSheetOpen(true)
  }

  const handleNewTransaction = () => {
    setEditingTransaction(null)
    setIsSheetOpen(true)
  }

  const handleSubmit = async (input: Parameters<typeof createTransaction>[0]) => {
    if (editingTransaction) {
      await updateTransaction({
        ...input,
        id: editingTransaction.id,
      })
    } else {
      await createTransaction(input)
    }
  }

  const handleSuccess = () => {
    setIsSheetOpen(false)
    setEditingTransaction(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">
                +{summary.income.toFixed(0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-rose-600">
                -{summary.expense.toFixed(0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${
                  summary.balance >= 0 ? "text-slate-900" : "text-rose-600"
                }`}
              >
                {summary.balance.toFixed(0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="pt-6">
              <p className="text-rose-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TransactionList
              categories={categories}
              transactions={transactions}
              onTransactionPress={handleTransactionPress}
            />
          </CardContent>
        </Card>

        {/* FAB Button */}
        <Button
          onClick={handleNewTransaction}
          size="icon"
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Transaction Form Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[90vh]">
            <SheetHeader>
              <SheetTitle>
                {editingTransaction ? "Edit Transaction" : "New Transaction"}
              </SheetTitle>
              <SheetDescription>
                {editingTransaction
                  ? "Update your transaction details"
                  : "Add a new transaction with category emoji"}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <TransactionForm
                categories={categories}
                isSubmitting={isCreating || isUpdating}
                onSubmit={handleSubmit}
                onSuccess={handleSuccess}
                initialValues={
                  editingTransaction
                    ? {
                        id: editingTransaction.id,
                        type: editingTransaction.type,
                        amount: editingTransaction.amount.toString(),
                        category: editingTransaction.category,
                        memo: editingTransaction.memo ?? "",
                        spentAt: editingTransaction.spentAt,
                      }
                    : undefined
                }
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
