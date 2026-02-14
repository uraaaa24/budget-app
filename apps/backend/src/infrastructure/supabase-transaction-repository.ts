import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Transaction } from "@/domain/transaction";
import type {
  CreateTransactionInput,
  TransactionRepository,
} from "@/domain/transaction-repository";

type TransactionRow = {
  id: string;
  type: "expense" | "income";
  amount: number;
  category: string;
  memo: string | null;
  spent_at: string;
  created_at: string;
};

const SELECT_COLUMNS = "id, type, amount, category, memo, spent_at, created_at";

export class SupabaseTransactionRepository implements TransactionRepository {
  private readonly client: SupabaseClient;

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
    });
  }

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const { data, error } = await this.client
      .from(this.tableName)
      .insert({
        type: input.type,
        amount: input.amount,
        category: input.category,
        memo: input.memo ?? null,
        spent_at: input.spentAt,
      })
      .select(SELECT_COLUMNS)
      .single<TransactionRow>();

    if (error || !data) {
      throw new Error(`Failed to create transaction: ${error?.message ?? "unknown"}`);
    }

    return toDomainTransaction(data);
  }

  async list(): Promise<Transaction[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(SELECT_COLUMNS)
      .order("created_at", { ascending: false })
      .returns<TransactionRow[]>();

    if (error || !data) {
      throw new Error(`Failed to list transactions: ${error?.message ?? "unknown"}`);
    }

    return data.map(toDomainTransaction);
  }
}

const toDomainTransaction = (row: TransactionRow): Transaction => ({
  id: row.id,
  type: row.type,
  amount: row.amount,
  category: row.category,
  memo: row.memo ?? undefined,
  spentAt: row.spent_at,
  createdAt: row.created_at,
});
