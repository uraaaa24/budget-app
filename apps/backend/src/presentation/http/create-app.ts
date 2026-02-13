import { Hono } from "hono";
import { cors } from "hono/cors";
import { CreateExpenseUseCase } from "@/application/create-expense-use-case.js";
import { GetHealthUseCase } from "@/application/get-health-use-case.js";
import { ListExpensesUseCase } from "@/application/list-expenses-use-case.js";
import { InMemoryExpenseRepository } from "@/infrastructure/in-memory-expense-repository.js";
import { SystemHealthRepository } from "@/infrastructure/system-health-repository.js";
import { registerExpenseRoutes } from "@/presentation/http/register-expense-routes.js";
import { registerHealthRoute } from "@/presentation/http/register-health-route.js";

export const createApp = () => {
  const app = new Hono();
  app.use("*", cors());

  const healthRepository = new SystemHealthRepository();
  const getHealthUseCase = new GetHealthUseCase(healthRepository);
  const expenseRepository = new InMemoryExpenseRepository();
  const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository);
  const listExpensesUseCase = new ListExpensesUseCase(expenseRepository);

  registerHealthRoute(app, getHealthUseCase);
  registerExpenseRoutes(app, createExpenseUseCase, listExpensesUseCase);

  return app;
};
