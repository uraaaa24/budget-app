import { randomUUID } from "node:crypto"
import type { Transaction } from "@/domain/transaction"
import type {
  CreateTransactionInput,
  TransactionRepository,
} from "@/domain/transaction-repository"

export class InMemoryTransactionRepository implements TransactionRepository {
  private readonly transactionsByUser = new Map<string, Transaction[]>()

  async create(userId: string, input: CreateTransactionInput): Promise<Transaction> {
    const transaction: Transaction = {
      id: randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
      ...input,
    }

    const existing = this.transactionsByUser.get(userId) ?? []
    existing.unshift(transaction)
    this.transactionsByUser.set(userId, existing)
    return transaction
  }

  async listByUser(userId: string): Promise<Transaction[]> {
    return this.transactionsByUser.get(userId) ?? []
  }
}
