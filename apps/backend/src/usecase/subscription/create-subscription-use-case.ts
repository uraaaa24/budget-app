import type {
  CreateSubscriptionInput,
  SubscriptionRepository,
} from "@/domain/subscription/subscription-repository"

export class CreateSubscriptionUseCase {
  constructor(private readonly repository: SubscriptionRepository) {}

  async execute(userId: string, input: CreateSubscriptionInput) {
    return this.repository.create(userId, input)
  }
}
