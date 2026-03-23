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

export type SubscriptionListResponse = {
  items: Subscription[]
  summary: SubscriptionSummary
}

export type CreateSubscriptionInput = {
  name: string
  amount: number
  currency?: string
  billingCycle: SubscriptionBillingCycle
  startDate: string
  nextBillingDate: string
  status: SubscriptionStatus
  memo?: string
  paymentMethod?: string
  categoryId?: string
}

export type UpdateSubscriptionInput = CreateSubscriptionInput & {
  id: string
}

export type SubscriptionFormValues = {
  name: string
  amount: string
  currency: string
  billingCycle: SubscriptionBillingCycle
  startDate: Date
  nextBillingDate: Date
  status: SubscriptionStatus
  memo: string
  paymentMethod: string
}
