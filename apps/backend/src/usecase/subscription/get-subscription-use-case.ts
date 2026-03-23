import type { SubscriptionRepository } from "@/domain/subscription/subscription-repository"

export class GetSubscriptionUseCase {
  constructor(private readonly repository: SubscriptionRepository) {}

  async execute(userId: string, id: string) {
    const subscription = await this.repository.findById(userId, id)
    if (!subscription) {
      throw new Error("Subscription not found")
    }
    return subscription
  }
}
