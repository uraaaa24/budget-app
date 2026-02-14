import { randomUUID } from "node:crypto";
import type { Transaction } from "@/domain/transaction";
import type {
  CreateTransactionInput,
  TransactionRepository,
} from "@/domain/transaction-repository";

export class InMemoryTransactionRepository implements TransactionRepository {
  private readonly transactions: Transaction[] = [];

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const transaction: Transaction = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...input,
    };

    this.transactions.unshift(transaction);
    return transaction;
  }

  async list(): Promise<Transaction[]> {
    return this.transactions;
  }
}
