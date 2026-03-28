import type { GetUserId } from "@/presentation/http/auth/get-user-id"
import type { CreateTransactionUseCase } from "@/usecase/transaction/create-transaction-use-case"
import type { DeleteTransactionUseCase } from "@/usecase/transaction/delete-transaction-use-case"
import type { ListTransactionsUseCase } from "@/usecase/transaction/list-transactions-use-case"
import type { UpdateTransactionUseCase } from "@/usecase/transaction/update-transaction-use-case"
import { API_PATHS } from "@repo/validation/api-paths"
import {
  createTransactionBodySchema,
  deleteTransactionParamsSchema,
  transactionListResponseSchema,
  transactionSchema,
  updateTransactionBodySchema,
  updateTransactionParamsSchema,
} from "@repo/validation/transaction"
import type { Hono } from "hono"
import { describeRoute, resolver, validator } from "hono-openapi"

export const registerTransactionRoutes = (
  app: Hono,
  createTransactionUseCase: CreateTransactionUseCase,
  listTransactionsUseCase: ListTransactionsUseCase,
  updateTransactionUseCase: UpdateTransactionUseCase,
  deleteTransactionUseCase: DeleteTransactionUseCase,
  getUserId: GetUserId,
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
      const userId = await getUserId(c)
      if (userId instanceof Response) {
        return userId
      }

      const payload = c.req.valid("json")
      const transaction = await createTransactionUseCase.execute(
        userId,
        payload,
      )
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
      const userId = await getUserId(c)
      if (userId instanceof Response) {
        return userId
      }

      const transactions = await listTransactionsUseCase.execute(userId)
      return c.json({ items: transactions })
    },
  )

  app.put(
    `${API_PATHS.transactions}/:id`,
    describeRoute({
      summary: "Update transaction",
      tags: ["transactions"],
      responses: {
        200: {
          description: "Updated transaction",
          content: {
            "application/json": {
              schema: resolver(transactionSchema),
            },
          },
        },
      },
    }),
    validator("json", updateTransactionBodySchema),
    validator("param", updateTransactionParamsSchema),
    async (c) => {
      const userId = await getUserId(c)
      if (userId instanceof Response) {
        return userId
      }

      const { id } = c.req.valid("param")
      const payload = c.req.valid("json")
      const transaction = await updateTransactionUseCase.execute(
        userId,
        id,
        payload,
      )
      return c.json(transaction, 200)
    },
  )

  app.delete(
    `${API_PATHS.transactions}/:id`,
    describeRoute({
      summary: "Delete transaction",
      tags: ["transactions"],
      responses: {
        204: {
          description: "Transaction deleted",
        },
      },
    }),
    validator("param", deleteTransactionParamsSchema),
    async (c) => {
      const userId = await getUserId(c)
      if (userId instanceof Response) {
        return userId
      }

      const { id } = c.req.valid("param")
      await deleteTransactionUseCase.execute(userId, id)
      return c.body(null, 204)
    },
  )
}
