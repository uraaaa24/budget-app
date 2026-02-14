import { env } from "@/core/env"
import type { TransactionRepository } from "@/domain/transaction/transaction-repository"
import { getDbClient } from "@/infrastructure/database/client"
import { DrizzleTransactionRepository } from "@/infrastructure/database/transaction/drizzle-transaction-repository"

export const createTransactionRepository = (): TransactionRepository => {
  const db = getDbClient(env.DATABASE_URL)
  return new DrizzleTransactionRepository(db)
}
