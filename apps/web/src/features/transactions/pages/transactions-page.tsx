import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
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
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-24 space-y-8">
        {/* Summary Section */}
        <section className="space-y-6">
          {/* Balance Display */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">今月の収支</p>
            {balance === 0 && summary.income > 0 && summary.expense > 0 ? (
              <p className="text-3xl font-semibold text-foreground/70 tabular-nums">
                ちょうど 0 円
              </p>
            ) : (
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-4xl font-bold tracking-tight tabular-nums ${
                    isPositive
                      ? "text-[color:var(--income)]"
                      : "text-[color:var(--expense)]"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {balance.toLocaleString()}
                </p>
                <p className="text-base text-muted-foreground">円</p>
              </div>
            )}
          </div>

          {/* Income & Expense - Simple, no cards */}
          <div className="flex gap-6">
            <div className="flex-1 space-y-1.5">
              <p className="text-xs text-muted-foreground">収入</p>
              <p className="text-2xl font-semibold text-[color:var(--income)] tabular-nums">
                {summary.income.toLocaleString()}
              </p>
            </div>
            <div className="flex-1 space-y-1.5">
              <p className="text-xs text-muted-foreground">支出</p>
              <p className="text-2xl font-semibold text-[color:var(--expense)] tabular-nums">
                {summary.expense.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-1">
            <p className="text-sm font-medium text-destructive">
              あれ、うまく読み込めませんでした
            </p>
            <p className="text-xs text-destructive/80">
              もう一度試してみてください
            </p>
          </div>
        )}

        {/* Transaction List */}
        <section>
          <TransactionList
            categories={categories}
            transactions={transactions}
            onTransactionPress={handleTransactionPress}
          />
        </section>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
            記録しました
          </div>
        )}

        {/* FAB Button - Safe mobile positioning */}
        <Button
          onClick={handleNewTransaction}
          size="icon"
          className="fixed bottom-8 right-4 h-14 w-14 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Transaction Form Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[90vh] px-6">
            <SheetHeader className="pb-6 border-b border-border">
              <SheetTitle className="text-lg font-medium">
                {editingTransaction ? "記録を編集" : "記録"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto h-[calc(90vh-88px)] px-1">
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
