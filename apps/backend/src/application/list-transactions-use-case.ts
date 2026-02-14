import type { TransactionRepository } from "@/domain/transaction-repository";

export class ListTransactionsUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute() {
    return this.repository.list();
  }
}
