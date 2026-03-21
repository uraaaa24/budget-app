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
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

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

  const handleSubmit = async (
    input: Parameters<typeof createTransaction>[0],
  ) => {
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
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 2000)
  }

  const balance = summary.income - summary.expense
  const isPositive = balance >= 0

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* Summary */}
        <div className="rounded-2xl bg-card border border-border/40 p-5 space-y-5">
          {/* Balance */}
          {balance === 0 && summary.income > 0 && summary.expense > 0 ? (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">今月の収支</p>
              <p className="text-2xl font-semibold text-foreground/70">ちょうど 0 円</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">今月の収支</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold tracking-tight tabular-nums ${
                  isPositive
                    ? 'text-emerald-600 dark:text-emerald-500'
                    : 'text-rose-600 dark:text-rose-500'
                }`}>
                  {isPositive ? '+' : ''}{balance.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">円</p>
              </div>
            </div>
          )}

          {/* Income & Expense */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 p-3 space-y-1">
              <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">収入</p>
              <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {summary.income.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-rose-50/50 dark:bg-rose-950/20 p-3 space-y-1">
              <p className="text-xs text-rose-700/70 dark:text-rose-400/70">支出</p>
              <p className="text-xl font-semibold text-rose-700 dark:text-rose-400 tabular-nums">
                {summary.expense.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 space-y-1">
            <p className="text-xs text-destructive/80">うまく読み込めませんでした</p>
            <p className="text-xs text-destructive/60">{error}</p>
          </div>
        )}

        {/* Transaction List */}
        <div className="space-y-2">
          <TransactionList
            categories={categories}
            transactions={transactions}
            onTransactionPress={handleTransactionPress}
          />
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            記録しました ✓
          </div>
        )}

        {/* FAB Button */}
        <Button
          onClick={handleNewTransaction}
          size="icon"
          className="fixed bottom-6 right-4 h-14 w-14 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Transaction Form Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[85vh] px-4">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-base font-semibold">
                {editingTransaction ? "記録を編集" : "記録"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-2 px-4">
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
