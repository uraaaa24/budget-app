import type {
  Subscription,
  SubscriptionSummary,
} from "@/domain/subscription/subscription"

export type CreateSubscriptionInput = {
  name: string
  amount: number
  currency?: string
  billingCycle: "monthly" | "yearly" | "weekly"
  startDate: string
  nextBillingDate: string
  status: "active" | "paused" | "canceled"
  memo?: string
  paymentMethod?: string
  categoryId?: string
}

export type UpdateSubscriptionInput = CreateSubscriptionInput

export type SubscriptionListResult = {
  items: Subscription[]
  summary: SubscriptionSummary
}

export interface SubscriptionRepository {
  create(userId: string, input: CreateSubscriptionInput): Promise<Subscription>
  findByUserId(userId: string): Promise<SubscriptionListResult>
  findById(userId: string, id: string): Promise<Subscription | null>
  update(
    userId: string,
    id: string,
    input: UpdateSubscriptionInput,
  ): Promise<Subscription>
  delete(userId: string, id: string): Promise<void>
  findDueForBilling(date: Date): Promise<Subscription[]>
  updateNextBillingDate(id: string, nextBillingDate: Date): Promise<void>
}
