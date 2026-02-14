import type { Expense } from "@/domain/expense";

export type CreateExpenseInput = Omit<Expense, "id" | "createdAt">;

export type ExpenseRepository = {
  create(input: CreateExpenseInput): Promise<Expense>;
  list(): Promise<Expense[]>;
};
