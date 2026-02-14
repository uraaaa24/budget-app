import { CreateTransactionUseCase } from "@/application/create-transaction-use-case"
import { ListTransactionsUseCase } from "@/application/list-transactions-use-case"
import { createTransactionRepository } from "@/infrastructure/create-transaction-repository"
import { registerSystemRoutes } from "@/presentation/http/register-system-routes"
import { registerTransactionRoutes } from "@/presentation/http/register-transaction-routes"
import { Hono } from "hono"
import { cors } from "hono/cors"

export const createApp = () => {
  const app = new Hono()
  app.use("*", cors())

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
