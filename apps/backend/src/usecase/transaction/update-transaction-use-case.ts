import type { Transaction } from "@/domain/transaction/transaction"
import type {
  TransactionRepository,
  UpdateTransactionInput,
} from "@/domain/transaction/transaction-repository"

export class UpdateTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(
    userId: string,
    transactionId: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction> {
    return this.repository.update(userId, transactionId, input)
  }
}
