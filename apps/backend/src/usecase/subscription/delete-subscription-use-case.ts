import type { SubscriptionRepository } from "@/domain/subscription/subscription-repository"

export class DeleteSubscriptionUseCase {
  constructor(private readonly repository: SubscriptionRepository) {}

  async execute(userId: string, id: string) {
    await this.repository.delete(userId, id)
  }
}
