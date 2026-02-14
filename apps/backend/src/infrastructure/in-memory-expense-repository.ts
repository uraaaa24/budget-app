import { randomUUID } from "node:crypto";
import type { Expense } from "@/domain/expense";
import type {
  CreateExpenseInput,
  ExpenseRepository,
} from "@/domain/expense-repository";

export class InMemoryExpenseRepository implements ExpenseRepository {
  private readonly expenses: Expense[] = [];

  async create(input: CreateExpenseInput): Promise<Expense> {
    const expense: Expense = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...input,
    };

    this.expenses.unshift(expense);
    return expense;
  }

  async list(): Promise<Expense[]> {
    return this.expenses;
  }
}
