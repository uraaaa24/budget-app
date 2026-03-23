import type { Subscription } from "@/features/subscriptions/model/types"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Plus } from "lucide-react"

type SubscriptionListProps = {
  subscriptions: Subscription[]
  onSubscriptionPress?: (subscription: Subscription) => void
  onAddPress?: () => void
}

const getStatusBadgeStyles = (status: Subscription["status"]) => {
  switch (status) {
    case "active":
      return "bg-[color:var(--income-bg)] text-[color:var(--income)] border-[color:var(--income-border)]"
    case "paused":
      return "bg-muted text-muted-foreground border-border"
    case "canceled":
      return "bg-[color:var(--expense-bg)] text-[color:var(--expense)] border-[color:var(--expense-border)]"
  }
}

const getStatusLabel = (status: Subscription["status"]) => {
  switch (status) {
    case "active":
      return "有効"
    case "paused":
      return "一時停止"
    case "canceled":
      return "解約済み"
  }
}

const getCycleLabel = (cycle: Subscription["billingCycle"]) => {
  switch (cycle) {
    case "monthly":
      return "月額"
    case "yearly":
      return "年額"
    case "weekly":
      return "週額"
  }
}

export const SubscriptionList = ({
  subscriptions,
  onSubscriptionPress,
  onAddPress,
}: SubscriptionListProps) => {
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active")
  const otherSubscriptions = subscriptions.filter((s) => s.status !== "active")

  return (
    <div className="space-y-6">
      {/* Inline Add Button */}
      <button
        onClick={onAddPress}
        className="w-full px-4 py-4 rounded-lg border border-dashed border-border hover:border-primary hover:bg-accent/30 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Plus className="h-5 w-5" />
        <span className="text-base font-medium">新しいサブスクリプションを追加</span>
      </button>

      {subscriptions.length === 0 && (
        <div className="py-12 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            登録すると、毎月の固定費が一目で分かります
          </p>
        </div>
      )}
      {activeSubscriptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground px-1">
            有効
          </h3>
          <div className="divide-y divide-border">
            {activeSubscriptions.map((subscription) => (
              <button
                key={subscription.id}
                className="w-full text-left px-3 py-3 transition-colors hover:bg-accent/50 active:bg-accent"
                onClick={() => onSubscriptionPress?.(subscription)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-base font-medium text-foreground">
                      {subscription.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{getCycleLabel(subscription.billingCycle)}</span>
                      <span>•</span>
                      <span>
                        次回: {format(new Date(subscription.nextBillingDate), "M/d", { locale: ja })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <p className="text-lg font-semibold tabular-nums text-foreground">
                      ¥{subscription.amount.toLocaleString()}
                    </p>
                    {subscription.billingCycle === "yearly" && (
                      <p className="text-xs text-muted-foreground tabular-nums">
                        月¥{Math.round(subscription.monthlyAmount).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {otherSubscriptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground px-1">
            その他
          </h3>
          <div className="divide-y divide-border">
            {otherSubscriptions.map((subscription) => (
              <button
                key={subscription.id}
                className="w-full text-left px-3 py-3 transition-colors hover:bg-accent/50 active:bg-accent"
                onClick={() => onSubscriptionPress?.(subscription)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-medium text-foreground">
                        {subscription.name}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${getStatusBadgeStyles(subscription.status)}`}
                      >
                        {getStatusLabel(subscription.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{getCycleLabel(subscription.billingCycle)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-semibold tabular-nums text-muted-foreground">
                      ¥{subscription.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
