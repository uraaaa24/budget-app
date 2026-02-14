import { env } from "@/core/env";
import type { TransactionRepository } from "@/domain/transaction-repository";
import { InMemoryTransactionRepository } from "@/infrastructure/in-memory-transaction-repository";
import { SUPABASE_TABLES } from "@/infrastructure/supabase/constants";
import { SupabaseTransactionRepository } from "@/infrastructure/supabase-transaction-repository";

export const createTransactionRepository = (): TransactionRepository => {
  const hasUrl = Boolean(env.SUPABASE_URL);
  const hasServiceRoleKey = Boolean(env.SUPABASE_SERVICE_ROLE_KEY);

  if (hasUrl && hasServiceRoleKey) {
    return new SupabaseTransactionRepository(
      env.SUPABASE_URL!,
      env.SUPABASE_SERVICE_ROLE_KEY!,
      SUPABASE_TABLES.transactions,
    );
  }

  return new InMemoryTransactionRepository();
};
