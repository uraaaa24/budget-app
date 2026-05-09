import type { Subscription } from "@/features/subscriptions/model/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import type { VariantProps } from "class-variance-authority"
import type { badgeVariants } from "@/components/ui/badge"

type SubscriptionListProps = {
  subscriptions: Subscription[]
  onSubscriptionPress?: (subscription: Subscription) => void
}

const getStatusBadgeVariant = (
  status: Subscription["status"],
): VariantProps<typeof badgeVariants>["variant"] => {
  switch (status) {
    case "active":
      return "default"
    case "paused":
      return "secondary"
    case "canceled":
      return "destructive"
  }
}

const getStatusBadgeClassName = (status: Subscription["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-600 border-green-200 hover:bg-green-50"
    case "paused":
      return ""
    case "canceled":
      return "bg-red-50 text-red-600 border-red-200 hover:bg-red-50"
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
}: SubscriptionListProps) => {
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active")
  const otherSubscriptions = subscriptions.filter((s) => s.status !== "active")

  return (
    <div className="space-y-6">
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
              <Button
                key={subscription.id}
                variant="ghost"
                className="w-full h-auto justify-start text-left px-3 py-3 rounded-none hover:bg-accent/50 active:bg-accent"
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
              </Button>
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
              <Button
                key={subscription.id}
                variant="ghost"
                className="w-full h-auto justify-start text-left px-3 py-3 rounded-none hover:bg-accent/50 active:bg-accent"
                onClick={() => onSubscriptionPress?.(subscription)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-medium text-foreground">
                        {subscription.name}
                      </p>
                      <Badge
                        variant={getStatusBadgeVariant(subscription.status)}
                        className={getStatusBadgeClassName(subscription.status)}
                      >
                        {getStatusLabel(subscription.status)}
                      </Badge>
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
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
