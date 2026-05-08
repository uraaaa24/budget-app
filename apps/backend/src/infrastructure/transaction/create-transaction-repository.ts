import type { TransactionRepository } from "@/domain/transaction/transaction-repository"
import { getDbClient } from "@/infrastructure/database/client"
import { DrizzleTransactionRepository } from "@/infrastructure/database/transaction/drizzle-transaction-repository"

export const createTransactionRepository = (
  databaseUrl: string,
  authToken?: string,
): TransactionRepository => {
  const db = getDbClient(databaseUrl, authToken)
  return new DrizzleTransactionRepository(db)
}
