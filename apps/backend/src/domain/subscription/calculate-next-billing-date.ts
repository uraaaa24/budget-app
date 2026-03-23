import type { SubscriptionBillingCycle } from "@/domain/subscription/subscription"

/**
 * Calculate the next billing date based on the current billing date and cycle
 */
export const calculateNextBillingDate = (
  currentBillingDate: Date,
  billingCycle: SubscriptionBillingCycle,
): Date => {
  const next = new Date(currentBillingDate)

  switch (billingCycle) {
    case "weekly":
      next.setDate(next.getDate() + 7)
      break
    case "monthly":
      next.setMonth(next.getMonth() + 1)
      break
    case "yearly":
      next.setFullYear(next.getFullYear() + 1)
      break
  }

  return next
}
