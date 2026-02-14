import type { Hono } from "hono"
import { API_PATHS } from "@repo/validation/api-paths"
import {
  createTransactionBodySchema,
  transactionListResponseSchema,
  transactionSchema,
} from "@repo/validation/transaction"
import { describeRoute, resolver, validator } from "hono-openapi"
import type { CreateTransactionUseCase } from "@/application/transaction/create-transaction-use-case"
import type { ListTransactionsUseCase } from "@/application/transaction/list-transactions-use-case"
import { requireUserId } from "@/presentation/http/auth/require-user-id"

export const registerTransactionRoutes = (
  app: Hono,
  createTransactionUseCase: CreateTransactionUseCase,
  listTransactionsUseCase: ListTransactionsUseCase,
) => {
  app.post(
    API_PATHS.transactions,
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
      const userId = await requireUserId(c)
      if (userId instanceof Response) {
        return userId
      }

      const payload = c.req.valid("json")
      const transaction = await createTransactionUseCase.execute(userId, payload)
      return c.json(transaction, 201)
    },
  )

  app.get(
    API_PATHS.transactions,
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
      const userId = await requireUserId(c)
      if (userId instanceof Response) {
        return userId
      }

      const transactions = await listTransactionsUseCase.execute(userId)
      return c.json({ items: transactions })
    },
  )
}
