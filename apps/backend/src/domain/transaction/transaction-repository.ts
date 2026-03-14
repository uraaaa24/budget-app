import type { Transaction } from "@/domain/transaction/transaction"

export type CreateTransactionInput = Omit<
  Transaction,
  "id" | "createdAt" | "updatedAt" | "userId"
>

export type UpdateTransactionInput = Omit<
  Transaction,
  "id" | "createdAt" | "updatedAt" | "userId"
>

export type TransactionRepository = {
  create(userId: string, input: CreateTransactionInput): Promise<Transaction>
  listByUser(userId: string): Promise<Transaction[]>
  update(userId: string, transactionId: string, input: UpdateTransactionInput): Promise<Transaction>
}
