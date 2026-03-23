import type {
  SubscriptionRepository,
  UpdateSubscriptionInput,
} from "@/domain/subscription/subscription-repository"

export class UpdateSubscriptionUseCase {
  constructor(private readonly repository: SubscriptionRepository) {}

  async execute(userId: string, id: string, input: UpdateSubscriptionInput) {
    return this.repository.update(userId, id, input)
  }
}
