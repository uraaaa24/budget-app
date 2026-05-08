import { logger } from "@/core/logger"
import type { CategoryRepository } from "@/domain/category/category-repository"
import type { UserRepository } from "@/domain/user/user-repository"

export type EnsureUserExistsInput = {
  userId: string
  email?: string
  name?: string
}

const DEFAULT_CATEGORIES = [
  { name: "食費", emoji: "🍽️", type: "expense" as const },
  { name: "交通費", emoji: "🚃", type: "expense" as const },
  { name: "娯楽", emoji: "🎮", type: "expense" as const },
  { name: "日用品", emoji: "🧴", type: "expense" as const },
  { name: "給料", emoji: "💰", type: "income" as const },
  { name: "その他収入", emoji: "💵", type: "income" as const },
  { name: "その他支出", emoji: "💸", type: "expense" as const },
]

export class EnsureUserExistsUseCase {
  constructor(
    private userRepository: UserRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async execute(input: EnsureUserExistsInput): Promise<void> {
    const existingUser = await this.userRepository.findById(input.userId)

    if (existingUser) {
      return
    }

    logger.info("user_auto_creation", {
      userId: input.userId,
      email: input.email,
    })

    const now = new Date()
    await this.userRepository.create({
      id: input.userId,
      email: input.email ?? null,
      name: input.name ?? null,
      createdAt: now,
      updatedAt: now,
    })

    for (const defaultCategory of DEFAULT_CATEGORIES) {
      await this.categoryRepository.create(input.userId, {
        name: defaultCategory.name,
        emoji: defaultCategory.emoji,
        type: defaultCategory.type,
      })
    }

    logger.info("user_created_with_default_categories", {
      userId: input.userId,
      categoriesCount: DEFAULT_CATEGORIES.length,
    })
  }
}
