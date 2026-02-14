import { env } from "@/core/env"
import type { TransactionRepository } from "@/domain/transaction-repository"
import { SupabaseTransactionRepository } from "@/infrastructure/supabase-transaction-repository"
import { SUPABASE_TABLES } from "@/infrastructure/supabase/constants"

export const createTransactionRepository = (): TransactionRepository => {
  return new SupabaseTransactionRepository(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_TABLES.transactions,
  )
}
