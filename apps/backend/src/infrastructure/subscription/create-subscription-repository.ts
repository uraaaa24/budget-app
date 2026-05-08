import type { SubscriptionRepository } from "@/domain/subscription/subscription-repository"
import { getDbClient } from "@/infrastructure/database/client"
import { DrizzleSubscriptionRepository } from "@/infrastructure/database/subscription/drizzle-subscription-repository"

export const createSubscriptionRepository = (
  databaseUrl: string,
  authToken?: string,
): SubscriptionRepository => {
  const db = getDbClient(databaseUrl, authToken)
  return new DrizzleSubscriptionRepository(db)
}
