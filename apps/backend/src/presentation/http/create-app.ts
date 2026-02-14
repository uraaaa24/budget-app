import { Hono } from "hono";
import { cors } from "hono/cors";
import { CreateExpenseUseCase } from "@/application/create-expense-use-case";
import { ListExpensesUseCase } from "@/application/list-expenses-use-case";
import { InMemoryExpenseRepository } from "@/infrastructure/in-memory-expense-repository";
import { registerExpenseRoutes } from "@/presentation/http/register-expense-routes";
import { registerSystemRoutes } from "@/presentation/http/register-system-routes";

export const createApp = () => {
  const app = new Hono();
  app.use("*", cors());

  // Expense Management
  const expenseRepository = new InMemoryExpenseRepository();
  const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository);
  const listExpensesUseCase = new ListExpensesUseCase(expenseRepository);

  registerSystemRoutes(app);
  registerExpenseRoutes(app, createExpenseUseCase, listExpensesUseCase);

  return app;
};
