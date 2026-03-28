import type { TransactionRepository } from "@/domain/transaction/transaction-repository"

export class DeleteTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(userId: string, transactionId: string): Promise<void> {
    await this.repository.delete(userId, transactionId)
  }
}
