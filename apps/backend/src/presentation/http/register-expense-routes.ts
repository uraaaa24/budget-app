import type { Hono } from "hono";
import { createExpenseBodySchema } from "@repo/validation/expense";
import type { CreateExpenseUseCase } from "@/application/create-expense-use-case.js";
import type { ListExpensesUseCase } from "@/application/list-expenses-use-case.js";

export const registerExpenseRoutes = (
  app: Hono,
  createExpenseUseCase: CreateExpenseUseCase,
  listExpensesUseCase: ListExpensesUseCase,
) => {
  app.post("/expenses", async (c) => {
    const payload = await c.req.json().catch(() => null);
    const result = createExpenseBodySchema.safeParse(payload);

    if (!result.success) {
      return c.json(
        {
          error: "Invalid request body",
          issues: result.error.issues,
        },
        400,
      );
    }

    const expense = await createExpenseUseCase.execute(result.data);
    return c.json(expense, 201);
  });

  app.get("/expenses", async (c) => {
    const expenses = await listExpensesUseCase.execute();
    return c.json({ items: expenses });
  });
};
