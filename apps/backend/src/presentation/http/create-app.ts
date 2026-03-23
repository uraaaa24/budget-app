import { logger } from "@/core/logger"
import { createCategoryRepository } from "@/infrastructure/category/create-category-repository"
import { createTransactionRepository } from "@/infrastructure/transaction/create-transaction-repository"
import { createSubscriptionRepository } from "@/infrastructure/subscription/create-subscription-repository"
import { requireUserId } from "@/presentation/http/auth/require-user-id"
import { registerCategoryRoutes } from "@/presentation/http/category/register-category-routes"
import { registerSystemRoutes } from "@/presentation/http/system/register-system-routes"
import { registerTransactionRoutes } from "@/presentation/http/transaction/register-transaction-routes"
import { registerSubscriptionRoutes } from "@/presentation/http/subscription/register-subscription-routes"
import { CreateCategoryUseCase } from "@/usecase/category/create-category-use-case"
import { ListCategoriesUseCase } from "@/usecase/category/list-categories-use-case"
import { CreateTransactionUseCase } from "@/usecase/transaction/create-transaction-use-case"
import { ListTransactionsUseCase } from "@/usecase/transaction/list-transactions-use-case"
import { UpdateTransactionUseCase } from "@/usecase/transaction/update-transaction-use-case"
import { CreateSubscriptionUseCase } from "@/usecase/subscription/create-subscription-use-case"
import { ListSubscriptionsUseCase } from "@/usecase/subscription/list-subscriptions-use-case"
import { GetSubscriptionUseCase } from "@/usecase/subscription/get-subscription-use-case"
import { UpdateSubscriptionUseCase } from "@/usecase/subscription/update-subscription-use-case"
import { DeleteSubscriptionUseCase } from "@/usecase/subscription/delete-subscription-use-case"
import { ProcessSubscriptionBillingsUseCase } from "@/usecase/subscription/process-subscription-billings-use-case"
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
  const subscriptionRepository = createSubscriptionRepository()

  const createTransactionUseCase = new CreateTransactionUseCase(
    transactionRepository,
  )
  const listTransactionsUseCase = new ListTransactionsUseCase(
    transactionRepository,
  )
  const updateTransactionUseCase = new UpdateTransactionUseCase(
    transactionRepository,
  )
  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository)
  const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository)

  const createSubscriptionUseCase = new CreateSubscriptionUseCase(
    subscriptionRepository,
  )
  const processSubscriptionBillingsUseCase =
    new ProcessSubscriptionBillingsUseCase(
      subscriptionRepository,
      transactionRepository,
    )
  const listSubscriptionsUseCase = new ListSubscriptionsUseCase(
    subscriptionRepository,
    processSubscriptionBillingsUseCase,
  )
  const getSubscriptionUseCase = new GetSubscriptionUseCase(
    subscriptionRepository,
  )
  const updateSubscriptionUseCase = new UpdateSubscriptionUseCase(
    subscriptionRepository,
  )
  const deleteSubscriptionUseCase = new DeleteSubscriptionUseCase(
    subscriptionRepository,
  )

  registerSystemRoutes(app)
  registerTransactionRoutes(
    app,
    createTransactionUseCase,
    listTransactionsUseCase,
    updateTransactionUseCase,
    requireUserId,
  )
  registerCategoryRoutes(
    app,
    createCategoryUseCase,
    listCategoriesUseCase,
    requireUserId,
  )
  registerSubscriptionRoutes(
    app,
    createSubscriptionUseCase,
    listSubscriptionsUseCase,
    getSubscriptionUseCase,
    updateSubscriptionUseCase,
    deleteSubscriptionUseCase,
    requireUserId,
  )

  return app
}
