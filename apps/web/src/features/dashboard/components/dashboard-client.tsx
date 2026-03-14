"use client"

import { useState } from "react"
import { useTransactionQuery } from "@/features/dashboard/hooks/use-transaction-query"
import { useCategoryQuery } from "@/features/dashboard/hooks/use-category-query"
import { TransactionList } from "./transaction-list"
import { TransactionModal } from "./transaction-modal"
import type { Transaction } from "@/features/dashboard/model/types"

export function DashboardClient() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { categories, queryError: categoryQueryError } = useCategoryQuery()
  const { transactions, summary, queryError } = useTransactionQuery()

  const error = queryError ?? categoryQueryError

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto max-w-4xl px-4 py-8">
        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3">
            <p className="text-rose-700">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Income</p>
            <p className="text-2xl font-semibold text-emerald-600">
              +{summary.income.toFixed(0)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Expense</p>
            <p className="text-2xl font-semibold text-rose-600">
              -{summary.expense.toFixed(0)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Balance</p>
            <p className="text-2xl font-semibold text-slate-900">
              {summary.balance.toFixed(0)}
            </p>
          </div>
        </div>

        <TransactionList
          categories={categories}
          transactions={transactions}
          onTransactionPress={(transaction) => {
            setSelectedTransaction(transaction)
            setIsModalOpen(true)
          }}
        />

        {/* Floating Add Button */}
        <button
          onClick={() => {
            setSelectedTransaction(null)
            setIsModalOpen(true)
          }}
          className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-2xl font-semibold text-white shadow-lg hover:bg-slate-800"
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
