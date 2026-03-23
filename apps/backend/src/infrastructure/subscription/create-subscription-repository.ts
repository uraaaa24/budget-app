import { env } from "@/core/env"
import type { SubscriptionRepository } from "@/domain/subscription/subscription-repository"
import { getDbClient } from "@/infrastructure/database/client"
import { DrizzleSubscriptionRepository } from "@/infrastructure/database/subscription/drizzle-subscription-repository"

export const createSubscriptionRepository = (): SubscriptionRepository => {
  const db = getDbClient(env.DATABASE_URL)
  return new DrizzleSubscriptionRepository(db)
}
