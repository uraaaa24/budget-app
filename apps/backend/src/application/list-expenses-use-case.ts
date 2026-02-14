import type { ExpenseRepository } from "@/domain/expense-repository";

export class ListExpensesUseCase {
  constructor(private readonly repository: ExpenseRepository) {}

  async execute() {
    return this.repository.list();
  }
}
