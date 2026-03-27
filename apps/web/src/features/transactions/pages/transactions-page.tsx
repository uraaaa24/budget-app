import { cn } from "#/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useMonth } from "@/contexts/month-context"
import { TransactionForm } from "@/features/transactions/components/transaction-form"
import { TransactionList } from "@/features/transactions/components/transaction-list"
import { useCategoryQuery } from "@/features/transactions/hooks/use-category-query"
import { useCreateTransaction } from "@/features/transactions/hooks/use-create-transaction"
import { useTransactionQuery } from "@/features/transactions/hooks/use-transaction-query"
import { useUpdateTransaction } from "@/features/transactions/hooks/use-update-transaction"
import type { Transaction } from "@/features/transactions/model/types"
import { useAuth } from "@clerk/clerk-react"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"

export const TransactionsPage = () => {
  const { userId } = useAuth()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)

  const {
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    goToPreviousMonth,
    goToNextMonth,
    isCurrentMonth,
  } = useMonth()

  const handleMonthSelect = (year: number, month: number) => {
    setSelectedYear(year)
    setSelectedMonth(month)
    setIsMonthPickerOpen(false)
  }

  const { categories, queryError: categoryQueryError } = useCategoryQuery()
  const { transactions: allTransactions, queryError } = useTransactionQuery()
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
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 2000)
  }

  const balance = summary.income - summary.expense
  const isPositive = balance >= 0

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-24 space-y-8">
        {/* Month Selector */}
        <section className="flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
          >
            ← 前月
          </button>

          <button
            onClick={() => setIsMonthPickerOpen(true)}
            className="text-xl font-medium hover:text-muted-foreground transition-colors px-4 py-2"
          >
            {selectedYear}.{String(selectedMonth + 1).padStart(2, "0")}
          </button>

          <button
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
            className={cn(
              "text-sm text-muted-foreground hover:text-foreground transition-opacity px-2 py-1",
              isCurrentMonth && "opacity-0 pointer-events-none",
            )}
          >
            次月 →
          </button>
        </section>

        {/* Summary Section */}
        <section className="space-y-6">
          {/* Balance Display */}
          {/* <div className="space-y-2">
            <p className="text-sm text-muted-foreground">月間収支</p>
            {balance === 0 && summary.income > 0 && summary.expense > 0 ? (
              <p className="text-3xl font-semibold text-foreground/70 tabular-nums">
                ちょうど 0 円
              </p>
            ) : (
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-4xl font-bold tracking-tight tabular-nums ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {balance.toLocaleString()}
                </p>
                <p className="text-base text-muted-foreground">円</p>
              </div>
            )}
          </div> */}

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
                        spentAt: editingTransaction.spentAt,
                      }
                    : undefined
                }
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Month Picker Sheet */}
        <Sheet open={isMonthPickerOpen} onOpenChange={setIsMonthPickerOpen}>
          <SheetContent side="bottom" className="h-[70vh] px-6">
            <SheetHeader className="pb-8">
              <SheetTitle className="text-base font-medium">
                月を選択
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-[calc(70vh-80px)] pb-8">
              {/* Year Selector */}
              <div className="mb-12">
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: 3 }, (_, i) => {
                    const year = new Date().getFullYear() - i
                    const isSelected = selectedYear === year
                    return (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-6 py-2 text-base transition-colors ${
                          isSelected
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {year}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => i).map((month) => {
                  const now = new Date()
                  const isCurrent =
                    selectedYear === now.getFullYear() &&
                    month === now.getMonth()
                  const isSelected = month === selectedMonth
                  const isFuture =
                    selectedYear > now.getFullYear() ||
                    (selectedYear === now.getFullYear() &&
                      month > now.getMonth())

                  return (
                    <button
                      key={month}
                      onClick={() =>
                        !isFuture && handleMonthSelect(selectedYear, month)
                      }
                      disabled={isFuture}
                      className={`h-14 text-base transition-colors rounded-lg ${
                        isSelected
                          ? "bg-foreground text-background font-medium"
                          : isFuture
                            ? "text-muted-foreground/30 cursor-not-allowed"
                            : "text-foreground hover:bg-accent"
                      } ${isCurrent && !isSelected ? "ring-1 ring-foreground/20" : ""}`}
                    >
                      {month + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
