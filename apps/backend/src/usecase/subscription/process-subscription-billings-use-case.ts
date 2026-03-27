import { logger } from "@/core/logger"
import { calculateNextBillingDate } from "@/domain/subscription/calculate-next-billing-date"
import type { SubscriptionRepository } from "@/domain/subscription/subscription-repository"
import type { TransactionRepository } from "@/domain/transaction/transaction-repository"

export class ProcessSubscriptionBillingsUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(date: Date = new Date()): Promise<void> {
    // Find all subscriptions due for billing
    const dueSubscriptions =
      await this.subscriptionRepository.findDueForBilling(date)

    logger.info("processing_subscription_billings", {
      date: date.toISOString(),
      count: dueSubscriptions.length,
    })

    // Process each subscription
    for (const subscription of dueSubscriptions) {
      try {
        // Create a transaction for this billing
        await this.transactionRepository.create(subscription.userId, {
          type: "expense",
          amount: subscription.amount,
          category: "Subscription",
          memo: subscription.name,
          spentAt: subscription.nextBillingDate, // Use the billing date
        })

        // Calculate and update next billing date
        const nextBillingDate = calculateNextBillingDate(
          new Date(subscription.nextBillingDate),
          subscription.billingCycle,
        )

        await this.subscriptionRepository.updateNextBillingDate(
          subscription.id,
          nextBillingDate,
        )

        logger.info("subscription_billing_processed", {
          subscriptionId: subscription.id,
          subscriptionName: subscription.name,
          amount: subscription.amount,
          nextBillingDate: nextBillingDate.toISOString(),
        })
      } catch (error) {
        logger.error("subscription_billing_failed", {
          subscriptionId: subscription.id,
          subscriptionName: subscription.name,
          error: error instanceof Error ? error.message : "Unknown error",
        })
        // Continue processing other subscriptions even if one fails
      }
    }
  }
}
