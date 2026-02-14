import type { Hono } from "hono";
import {
  createExpenseBodySchema,
  expenseListResponseSchema,
  expenseSchema,
} from "@repo/validation/expense";
import { describeRoute, resolver, validator } from "hono-openapi";
import type { CreateExpenseUseCase } from "@/application/create-expense-use-case";
import type { ListExpensesUseCase } from "@/application/list-expenses-use-case";

export const registerExpenseRoutes = (
  app: Hono,
  createExpenseUseCase: CreateExpenseUseCase,
  listExpensesUseCase: ListExpensesUseCase,
) => {
  app.post(
    "/expenses",
    describeRoute({
      summary: "Create expense",
      tags: ["expenses"],
      responses: {
        201: {
          description: "Created expense",
          content: {
            "application/json": {
              schema: resolver(expenseSchema),
            },
          },
        },
      },
    }),
    validator("json", createExpenseBodySchema),
    async (c) => {
      const payload = c.req.valid("json");
      const expense = await createExpenseUseCase.execute(payload);
      return c.json(expense, 201);
    },
  );

  app.get(
    "/expenses",
    describeRoute({
      summary: "List expenses",
      tags: ["expenses"],
      responses: {
        200: {
          description: "Expense list",
          content: {
            "application/json": {
              schema: resolver(expenseListResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const expenses = await listExpensesUseCase.execute();
      return c.json({ items: expenses });
    },
  );
};
