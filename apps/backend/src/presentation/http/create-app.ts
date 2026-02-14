import { CreateTransactionUseCase } from "@/application/transaction/create-transaction-use-case"
import { logger } from "@/core/logger"
import { ListTransactionsUseCase } from "@/application/transaction/list-transactions-use-case"
import { createTransactionRepository } from "@/infrastructure/transaction/create-transaction-repository"
import { registerSystemRoutes } from "@/presentation/http/system/register-system-routes"
import { registerTransactionRoutes } from "@/presentation/http/transaction/register-transaction-routes"
import { Hono } from "hono"
import { cors } from "hono/cors"

export const createApp = () => {
  const app = new Hono()
  app.use("*", cors())
  app.onError((error, c) => {
    logger.error("unhandled_http_error", {
      method: c.req.method,
      path: c.req.path,
      requestId: c.req.header("x-request-id") ?? null,
      errorName: error.name,
      errorMessage: error.message,
    })

    return c.json({ error: "Internal Server Error" }, 500)
  })

  const transactionRepository = createTransactionRepository()
  const createTransactionUseCase = new CreateTransactionUseCase(
    transactionRepository,
  )
  const listTransactionsUseCase = new ListTransactionsUseCase(
    transactionRepository,
  )

  registerSystemRoutes(app)
  registerTransactionRoutes(
    app,
    createTransactionUseCase,
    listTransactionsUseCase,
  )

  return app
}
