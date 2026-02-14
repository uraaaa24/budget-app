import type { Hono } from "hono";
import {
  createTransactionBodySchema,
  transactionListResponseSchema,
  transactionSchema,
} from "@repo/validation/transaction";
import { describeRoute, resolver, validator } from "hono-openapi";
import type { CreateTransactionUseCase } from "@/application/create-transaction-use-case";
import type { ListTransactionsUseCase } from "@/application/list-transactions-use-case";

export const registerTransactionRoutes = (
  app: Hono,
  createTransactionUseCase: CreateTransactionUseCase,
  listTransactionsUseCase: ListTransactionsUseCase,
) => {
  app.post(
    "/transactions",
    describeRoute({
      summary: "Create transaction",
      tags: ["transactions"],
      responses: {
        201: {
          description: "Created transaction",
          content: {
            "application/json": {
              schema: resolver(transactionSchema),
            },
          },
        },
      },
    }),
    validator("json", createTransactionBodySchema),
    async (c) => {
      const payload = c.req.valid("json");
      const transaction = await createTransactionUseCase.execute(payload);
      return c.json(transaction, 201);
    },
  );

  app.get(
    "/transactions",
    describeRoute({
      summary: "List transactions",
      tags: ["transactions"],
      responses: {
        200: {
          description: "Transaction list",
          content: {
            "application/json": {
              schema: resolver(transactionListResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const transactions = await listTransactionsUseCase.execute();
      return c.json({ items: transactions });
    },
  );
};
