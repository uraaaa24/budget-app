import type {
  CreateTransactionInput,
  TransactionRepository,
} from "@/domain/transaction-repository"

export class CreateTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(userId: string, input: CreateTransactionInput) {
    return this.repository.create(userId, input)
  }
}
