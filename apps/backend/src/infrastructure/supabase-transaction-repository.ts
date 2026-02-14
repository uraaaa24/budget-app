import type { Transaction } from "@/domain/transaction"
import type {
  CreateTransactionInput,
  TransactionRepository,
} from "@/domain/transaction-repository"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

type TransactionRow = {
  id: string
  user_id: string
  type: "expense" | "income"
  amount: number
  category: string
  memo: string | null
  spent_at: string
  created_at: string
}

const SELECT_COLUMNS =
  "id, user_id, type, amount, category, memo, spent_at, created_at"

export class SupabaseTransactionRepository implements TransactionRepository {
  private readonly client: SupabaseClient

  constructor(
    url: string,
    serviceRoleKey: string,
    private readonly tableName: string = "transactions",
  ) {
    this.client = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  async create(
    userId: string,
    input: CreateTransactionInput,
  ): Promise<Transaction> {
    const { data, error } = await this.client
      .from(this.tableName)
      .insert({
        user_id: userId,
        type: input.type,
        amount: input.amount,
        category: input.category,
        memo: input.memo ?? null,
        spent_at: input.spentAt,
      })
      .select(SELECT_COLUMNS)
      .single<TransactionRow>()

    if (error || !data) {
      throw new Error(
        `Failed to create transaction: ${error?.message ?? "unknown"}`,
      )
    }

    return toDomainTransaction(data)
  }

  async listByUser(userId: string): Promise<Transaction[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(SELECT_COLUMNS)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .returns<TransactionRow[]>()

    if (error || !data) {
      throw new Error(
        `Failed to list transactions: ${error?.message ?? "unknown"}`,
      )
    }

    return data.map(toDomainTransaction)
  }
}

const toDomainTransaction = (row: TransactionRow): Transaction => ({
  id: row.id,
  userId: row.user_id,
  type: row.type,
  amount: row.amount,
  category: row.category,
  memo: row.memo ?? undefined,
  spentAt: row.spent_at,
  createdAt: row.created_at,
})
