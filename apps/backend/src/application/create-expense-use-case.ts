import type {
  CreateExpenseInput,
  ExpenseRepository,
} from "@/domain/expense-repository.js";

export class CreateExpenseUseCase {
  constructor(private readonly repository: ExpenseRepository) {}

  async execute(input: CreateExpenseInput) {
    return this.repository.create(input);
  }
}
