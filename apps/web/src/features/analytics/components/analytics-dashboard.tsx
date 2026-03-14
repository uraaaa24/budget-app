"use client"

import { useMemo } from "react"
import { useTransactionQuery } from "@/features/dashboard/hooks/use-transaction-query"
import { useCategoryQuery } from "@/features/dashboard/hooks/use-category-query"
import { NavigationMenu } from "@/components/layout/navigation-menu"
import type { Transaction } from "@/features/dashboard/model/types"

export function AnalyticsDashboard() {
  const { transactions: allTransactions, queryError } = useTransactionQuery()
  const { categories } = useCategoryQuery()

  // Calculate monthly summary
  const monthlySummary = useMemo(() => {
    const monthMap = new Map<string, { income: number; expense: number }>()

    allTransactions.forEach((t) => {
      const date = new Date(t.spentAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      const current = monthMap.get(key) ?? { income: 0, expense: 0 }
      if (t.type === "income") {
        current.income += t.amount
      } else {
        current.expense += t.amount
      }
      monthMap.set(key, current)
    })

    return Array.from(monthMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 12)
      .reverse()
  }, [allTransactions])

  // Calculate category breakdown
  const categoryBreakdown = useMemo(() => {
    const categoryMap = new Map<string, number>()

    allTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = categoryMap.get(t.category) ?? 0
        categoryMap.set(t.category, current + t.amount)
      })

    return Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  }, [allTransactions])

  // Total summary
  const totalSummary = useMemo(() => {
    const income = allTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = allTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    return { income, expense, balance: income - expense }
  }, [allTransactions])

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <NavigationMenu />
      <main className="container mx-auto max-w-3xl px-6 py-8">
        {queryError && (
          <div className="mb-8 border-l-4 border-rose-500 bg-rose-50 p-4">
            <p className="text-sm text-rose-700">{queryError}</p>
          </div>
        )}

        <h1 className="mb-8 text-2xl font-bold text-slate-900">Dashboard</h1>

        {/* Total Summary */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            All Time Summary
          </h2>
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Total Income
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  +{totalSummary.income.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Total Expense
                </span>
                <span className="text-2xl font-bold text-rose-600">
                  -{totalSummary.expense.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Net Balance
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {totalSummary.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Monthly Trend */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Monthly Trend (Last 12 Months)
          </h2>
          <div className="space-y-3">
            {monthlySummary.map(([month, data]) => {
              const balance = data.income - data.expense
              return (
                <div key={month} className="border-b border-slate-200 pb-3">
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-sm font-medium text-slate-900">
                      {month}
                    </span>
                    <span
                      className={`text-base font-bold ${
                        balance >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {balance >= 0 ? "+" : ""}
                      {balance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs text-slate-600">
                    <span>収入: +{data.income.toLocaleString()}</span>
                    <span>支出: -{data.expense.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Category Breakdown */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Top Expense Categories
          </h2>
          <div className="space-y-3">
            {categoryBreakdown.map(([category, amount]) => {
              const percentage =
                totalSummary.expense > 0
                  ? (amount / totalSummary.expense) * 100
                  : 0
              return (
                <div key={category} className="border-b border-slate-200 pb-3">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm font-medium text-slate-900">
                      {category}
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-slate-900"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
