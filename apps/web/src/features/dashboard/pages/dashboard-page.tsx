import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data"
import { Link } from "@tanstack/react-router"

export const DashboardPage = () => {
  const { monthlyData, subscriptionSummary, isLoading } = useDashboardData()

  const hasData = monthlyData.topCategories.length > 0

  if (isLoading) {
    return (
      <>
        {/* Key Insights Skeleton */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-accent/30 rounded-2xl p-5 space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="bg-accent/30 rounded-2xl p-5 space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </section>

        {/* Subscription Summary Skeleton */}
        <section className="bg-accent/50 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-6">
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </section>

        {/* Category Breakdown Skeleton */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="bg-accent/30 rounded-2xl p-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* Key Insights */}
      {monthlyData.expense > 0 && (
        <section className="grid grid-cols-2 gap-4">
          {/* Daily Average */}
          <div className="bg-accent/30 rounded-2xl p-5 space-y-2">
            <p className="text-xs text-muted-foreground">1日平均</p>
            <p className="text-2xl font-bold tabular-nums">
              ¥{Math.round(monthlyData.dailyAverage).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {monthlyData.currentDay}/{monthlyData.daysInMonth}日経過
            </p>
          </div>

          {/* Previous Month Comparison */}
          <div className="bg-accent/30 rounded-2xl p-5 space-y-2">
            <p className="text-xs text-muted-foreground">先月比</p>
            {monthlyData.previousMonthExpense === 0 ? (
              <p className="text-sm text-muted-foreground">先月データなし</p>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <p
                    className={`text-2xl font-bold tabular-nums ${
                      monthlyData.expenseChange > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {monthlyData.expenseChange > 0 ? "+" : ""}
                    {Math.round(monthlyData.expenseChange).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">円</p>
                </div>
                <p
                  className={`text-xs tabular-nums ${
                    monthlyData.expenseChange > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {monthlyData.expenseChange > 0 ? "↑" : "↓"}{" "}
                  {Math.abs(monthlyData.expenseChangePercentage).toFixed(1)}%
                </p>
              </>
            )}
          </div>
        </section>
      )}

      {/* Subscription Summary */}
      {subscriptionSummary.activeCount > 0 && (
        <section className="bg-accent/50 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              サブスクリプション
            </h2>
            <Link
              to="/subscriptions"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              詳細 →
            </Link>
          </div>
          <div className="flex gap-6">
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">月額合計</p>
              <p className="text-xl font-semibold tabular-nums">
                ¥{Math.round(subscriptionSummary.monthlyTotal).toLocaleString()}
              </p>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">有効件数</p>
              <p className="text-xl font-semibold tabular-nums">
                {subscriptionSummary.activeCount}件
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Category Breakdown */}
      {monthlyData.topCategories.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              カテゴリ別支出
            </h2>
            <p className="text-xs text-muted-foreground">
              合計 ¥{monthlyData.expense.toLocaleString()}
            </p>
          </div>
          <div className="bg-accent/30 rounded-2xl p-5 space-y-4">
            {monthlyData.topCategories.map(({ category, amount, emoji }) => {
              const percentage =
                monthlyData.expense > 0
                  ? (amount / monthlyData.expense) * 100
                  : 0

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {emoji && <span className="text-base">{emoji}</span>}
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {percentage.toFixed(0)}%
                      </span>
                      <span className="text-sm font-semibold tabular-nums">
                        ¥{amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-accent/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {monthlyData.otherCategoriesTotal > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📦</span>
                    <span className="text-sm font-medium text-muted-foreground">
                      その他
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {(
                        (monthlyData.otherCategoriesTotal /
                          monthlyData.expense) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                    <span className="text-sm font-semibold tabular-nums">
                      ¥{monthlyData.otherCategoriesTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-accent/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-muted-foreground/40 transition-all"
                    style={{
                      width: `${((monthlyData.otherCategoriesTotal / monthlyData.expense) * 100).toFixed(0)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!hasData && !isLoading && (
        <section className="text-center py-12 space-y-3">
          <p className="text-muted-foreground">
            {monthlyData.year}年{monthlyData.month + 1}月の支出がありません
          </p>
          <Link
            to="/"
            className="text-sm text-primary hover:underline inline-block"
          >
            取引を追加する
          </Link>
        </section>
      )}
    </>
  )
}
