import { CreateCategoryUseCase } from "@/application/category/create-category-use-case"
import { ListCategoriesUseCase } from "@/application/category/list-categories-use-case"
import { CreateTransactionUseCase } from "@/application/transaction/create-transaction-use-case"
import { logger } from "@/core/logger"
import { ListTransactionsUseCase } from "@/application/transaction/list-transactions-use-case"
import { createCategoryRepository } from "@/infrastructure/category/create-category-repository"
import { createTransactionRepository } from "@/infrastructure/transaction/create-transaction-repository"
import { requireUserId } from "@/presentation/http/auth/require-user-id"
import { registerCategoryRoutes } from "@/presentation/http/category/register-category-routes"
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
  const categoryRepository = createCategoryRepository()
  const createTransactionUseCase = new CreateTransactionUseCase(
    transactionRepository,
  )
  const listTransactionsUseCase = new ListTransactionsUseCase(
    transactionRepository,
  )
  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository)
  const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository)

  registerSystemRoutes(app)
  registerTransactionRoutes(
    app,
    createTransactionUseCase,
    listTransactionsUseCase,
    requireUserId,
  )
  registerCategoryRoutes(
    app,
    createCategoryUseCase,
    listCategoriesUseCase,
    requireUserId,
  )

  return app
}
