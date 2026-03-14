import type { Transaction } from "@/domain/transaction/transaction"
import type {
  CreateTransactionInput,
  TransactionRepository,
  UpdateTransactionInput,
} from "@/domain/transaction/transaction-repository"
import type { DbClient } from "@/infrastructure/database/client"
import {
  transactions,
  type TransactionRow,
} from "@/infrastructure/database/schema/transactions"
import { and, desc, eq } from "drizzle-orm"

export class DrizzleTransactionRepository implements TransactionRepository {
  constructor(private readonly db: DbClient) {}

  async create(
    userId: string,
    input: CreateTransactionInput,
  ): Promise<Transaction> {
    const [row] = await this.db
      .insert(transactions)
      .values({
        userId,
        type: input.type,
        amount: input.amount,
        category: input.category,
        memo: input.memo ?? null,
        spentAt: new Date(input.spentAt),
        updatedAt: new Date(),
      })
      .returning()

    if (!row) {
      throw new Error("Failed to create transaction")
    }

    return toDomainTransaction(row)
  }

  async listByUser(userId: string): Promise<Transaction[]> {
    const rows = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))

    return rows.map(toDomainTransaction)
  }

  async update(
    userId: string,
    transactionId: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction> {
    const [row] = await this.db
      .update(transactions)
      .set({
        type: input.type,
        amount: input.amount,
        category: input.category,
        memo: input.memo ?? null,
        spentAt: new Date(input.spentAt),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId),
        ),
      )
      .returning()

    if (!row) {
      throw new Error("Transaction not found or unauthorized")
    }

    return toDomainTransaction(row)
  }
}

const toDomainTransaction = (row: TransactionRow): Transaction => ({
  id: row.id,
  userId: row.userId,
  type: row.type,
  amount: row.amount,
  category: row.category,
  memo: row.memo ?? undefined,
  spentAt: row.spentAt.toISOString(),
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
})
