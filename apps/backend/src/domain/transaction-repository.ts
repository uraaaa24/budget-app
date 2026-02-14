import type { Transaction } from "@/domain/transaction"

export type CreateTransactionInput = Omit<Transaction, "id" | "createdAt" | "userId">

export type TransactionRepository = {
  create(userId: string, input: CreateTransactionInput): Promise<Transaction>
  listByUser(userId: string): Promise<Transaction[]>
}
