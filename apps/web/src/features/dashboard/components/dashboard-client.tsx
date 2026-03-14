"use client"

import { useCategoryQuery } from "@/features/dashboard/hooks/use-category-query"
import { useTransactionQuery } from "@/features/dashboard/hooks/use-transaction-query"
import type { Transaction } from "@/features/dashboard/model/types"
import { useMemo, useState } from "react"
import { TransactionList } from "./transaction-list"
import { TransactionModal } from "./transaction-modal"

export function DashboardClient() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Current month state (year-month format)
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  })

  const { categories, queryError: categoryQueryError } = useCategoryQuery()
  const { transactions: allTransactions, queryError } = useTransactionQuery()

  const error = queryError ?? categoryQueryError

  // Filter transactions for current month
  const transactions = useMemo(() => {
    return allTransactions.filter((t) => {
      const date = new Date(t.spentAt)
      return (
        date.getFullYear() === currentDate.year &&
        date.getMonth() + 1 === currentDate.month
      )
    })
  }, [allTransactions, currentDate])

  // Calculate summary for current month only
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

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      if (prev.month === 1) {
        return { year: prev.year - 1, month: 12 }
      }
      return { year: prev.year, month: prev.month - 1 }
    })
  }

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      if (prev.month === 12) {
        return { year: prev.year + 1, month: 1 }
      }
      return { year: prev.year, month: prev.month + 1 }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      <main className="container mx-auto max-w-3xl px-6 py-8">
        {error && (
          <div className="mb-8 border-l-4 border-rose-500 bg-rose-50 p-4">
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        {/* Month Navigation */}
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousMonth}
              className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-75"
              aria-label="Previous month"
            >
              <svg
                className="h-5 w-5 text-slate-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-slate-900">
              {currentDate.year}年 {currentDate.month}月
            </h2>

            <button
              onClick={goToNextMonth}
              className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-75"
              aria-label="Next month"
            >
              <svg
                className="h-5 w-5 text-slate-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* Summary Section */}
        <section className="mb-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-600">
                  Income
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  +{summary.income.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="border-b border-slate-200 pb-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-600">
                  Expense
                </span>
                <span className="text-2xl font-bold text-rose-600">
                  -{summary.expense.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Transactions Section */}
        <section>
          <TransactionList
            categories={categories}
            transactions={transactions}
            onTransactionPress={(transaction) => {
              setSelectedTransaction(transaction)
              setIsModalOpen(true)
            }}
          />
        </section>

        {/* Floating Action Button */}
        <button
          onClick={() => {
            setSelectedTransaction(null)
            setIsModalOpen(true)
          }}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-2xl font-semibold text-white shadow-lg transition-opacity hover:opacity-75"
        >
          +
        </button>

        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          categories={categories}
          transaction={selectedTransaction}
        />
      </main>
    </div>
  )
}
