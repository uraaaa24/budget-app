import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { useMonth } from "@/contexts/month-context"
import { TransactionForm } from "@/features/transactions/components/transaction-form"
import { TransactionList } from "@/features/transactions/components/transaction-list"
import { useCategoryQuery } from "@/features/transactions/hooks/use-category-query"
import { useCreateTransaction } from "@/features/transactions/hooks/use-create-transaction"
import { useTransactionQuery } from "@/features/transactions/hooks/use-transaction-query"
import { useUpdateTransaction } from "@/features/transactions/hooks/use-update-transaction"
import type { Transaction } from "@/features/transactions/model/types"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import MonthSelect from "../components/month-select"

export const TransactionsPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)

  const { selectedYear, selectedMonth } = useMonth()

  const { categories, queryError: categoryQueryError } = useCategoryQuery()
  const { transactions: allTransactions, queryError, isLoading } = useTransactionQuery()
  const { isSubmitting: isCreating, submitTransaction: createTransaction } =
    useCreateTransaction()
  const { isSubmitting: isUpdating, submitTransaction: updateTransaction } =
    useUpdateTransaction()

  const error = queryError ?? categoryQueryError

  // Filter transactions by selected month
  const transactions = useMemo(() => {
    return allTransactions.filter((t) => {
      const date = new Date(t.spentAt)
      return (
        date.getFullYear() === selectedYear && date.getMonth() === selectedMonth
      )
    })
  }, [allTransactions, selectedYear, selectedMonth])

  // Calculate summary for selected month
  const summary = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((total, item) => total + item.amount, 0)
    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((total, item) => total + item.amount, 0)

    return {
      income,
      expense,
      balance: income - expense,
    }
  }, [transactions])

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
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-2xl px-4 pt-24 pb-24 space-y-8">
          {/* Month Selector */}
          <MonthSelect />

          {/* Summary Section Skeleton */}
          <section className="space-y-6">
            <div className="flex justify-center gap-16">
              <div className="space-y-2 text-center min-w-32">
                <Skeleton className="h-4 w-16 mx-auto" />
                <Skeleton className="h-10 w-28 mx-auto" />
              </div>
              <div className="space-y-2 text-center min-w-32">
                <Skeleton className="h-4 w-16 mx-auto" />
                <Skeleton className="h-10 w-28 mx-auto" />
              </div>
            </div>
          </section>

          {/* Transaction List Skeleton */}
          <section className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-accent/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </section>

          {/* FAB Button */}
          <Button
            disabled
            className="fixed bottom-8 right-4 h-16 w-16 rounded-full transition-all"
          >
            <Plus className="size-6" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-24 space-y-8">
        {/* Month Selector */}
        <MonthSelect />

        {/* Summary Section */}
        <section className="space-y-6">
          {/* Income & Expense */}
          <div className="flex justify-center gap-16">
            <div className="space-y-2 text-center min-w-32">
              <p className="text-xs text-muted-foreground">Income</p>
              <p className="text-4xl font-bold text-green-600 tabular-nums">
                {summary.income.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2 text-center min-w-32">
              <p className="text-xs text-muted-foreground">Expense</p>
              <p className="text-4xl font-bold text-red-600 tabular-nums">
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

        {/* FAB Button - Safe mobile positioning */}
        <Button
          onClick={handleNewTransaction}
          className="fixed bottom-8 right-4 h-16 w-16 rounded-full transition-all"
        >
          <Plus className="size-6" />
        </Button>

        {/* Transaction Form Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[90vh] px-6 flex flex-col">
            <SheetHeader className="pb-6 border-b border-border">
              <SheetTitle className="text-lg font-medium">
                {editingTransaction ? "記録を編集" : "記録"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto flex-1 px-1">
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
                        spentAt: new Date(editingTransaction.spentAt),
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
