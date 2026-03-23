export type SubscriptionBillingCycle = "monthly" | "yearly" | "weekly"
export type SubscriptionStatus = "active" | "paused" | "canceled"

export type Subscription = {
  id: string
  userId: string
  name: string
  amount: number
  currency: string
  billingCycle: SubscriptionBillingCycle
  startDate: string
  nextBillingDate: string
  status: SubscriptionStatus
  memo?: string
  paymentMethod?: string
  categoryId?: string
  createdAt: string
  updatedAt: string
  // Derived values
  monthlyAmount: number
  yearlyAmount: number
}

export type SubscriptionSummary = {
  activeCount: number
  pausedCount: number
  canceledCount: number
  monthlyTotal: number
  yearlyTotal: number
}
