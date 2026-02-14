import type { Transaction } from "@/domain/transaction";

export type CreateTransactionInput = Omit<Transaction, "id" | "createdAt">;

export type TransactionRepository = {
  create(input: CreateTransactionInput): Promise<Transaction>;
  list(): Promise<Transaction[]>;
};
