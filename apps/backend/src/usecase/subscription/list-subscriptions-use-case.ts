import type { SubscriptionRepository } from "@/domain/subscription/subscription-repository"
import type { ProcessSubscriptionBillingsUseCase } from "@/usecase/subscription/process-subscription-billings-use-case"

export class ListSubscriptionsUseCase {
  constructor(
    private readonly repository: SubscriptionRepository,
    private readonly processSubscriptionBillings: ProcessSubscriptionBillingsUseCase,
  ) {}

  async execute(userId: string) {
    // Automatically process any due billings before returning the list
    // This runs every time the user views their subscriptions
    await this.processSubscriptionBillings.execute()

    // Return the updated subscription list
    return this.repository.findByUserId(userId)
  }
}
