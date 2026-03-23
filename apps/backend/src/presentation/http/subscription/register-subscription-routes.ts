import type { GetUserId } from "@/presentation/http/auth/get-user-id"
import type { CreateSubscriptionUseCase } from "@/usecase/subscription/create-subscription-use-case"
import type { ListSubscriptionsUseCase } from "@/usecase/subscription/list-subscriptions-use-case"
import type { GetSubscriptionUseCase } from "@/usecase/subscription/get-subscription-use-case"
import type { UpdateSubscriptionUseCase } from "@/usecase/subscription/update-subscription-use-case"
import type { DeleteSubscriptionUseCase } from "@/usecase/subscription/delete-subscription-use-case"
import { API_PATHS } from "@repo/validation/api-paths"
import {
  createSubscriptionBodySchema,
  subscriptionListResponseSchema,
  subscriptionSchema,
  updateSubscriptionBodySchema,
  updateSubscriptionParamsSchema,
  getSubscriptionParamsSchema,
  deleteSubscriptionParamsSchema,
} from "@repo/validation/subscription"
import type { Hono } from "hono"
import { describeRoute, resolver, validator } from "hono-openapi"

export const registerSubscriptionRoutes = (
  app: Hono,
  createSubscriptionUseCase: CreateSubscriptionUseCase,
  listSubscriptionsUseCase: ListSubscriptionsUseCase,
  getSubscriptionUseCase: GetSubscriptionUseCase,
  updateSubscriptionUseCase: UpdateSubscriptionUseCase,
  deleteSubscriptionUseCase: DeleteSubscriptionUseCase,
  getUserId: GetUserId,
) => {
  // Create subscription
  app.post(
    API_PATHS.subscriptions,
    describeRoute({
      summary: "Create subscription",
      tags: ["subscriptions"],
      responses: {
        201: {
          description: "Created subscription",
          content: {
            "application/json": {
              schema: resolver(subscriptionSchema),
            },
          },
        },
      },
    }),
    validator("json", createSubscriptionBodySchema),
    async (c) => {
      const userId = await getUserId(c)
      if (userId instanceof Response) {
        return userId
      }

      const payload = c.req.valid("json")
      const subscription = await createSubscriptionUseCase.execute(
        userId,
        payload,
      )
      return c.json(subscription, 201)
    },
  )

  // List subscriptions with summary
  app.get(
    API_PATHS.subscriptions,
    describeRoute({
      summary: "List subscriptions",
      tags: ["subscriptions"],
      responses: {
        200: {
          description: "Subscription list with summary",
          content: {
            "application/json": {
              schema: resolver(subscriptionListResponseSchema),
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

      const result = await listSubscriptionsUseCase.execute(userId)
      return c.json(result)
    },
  )

  // Get single subscription
  app.get(
    `${API_PATHS.subscriptions}/:id`,
    describeRoute({
      summary: "Get subscription",
      tags: ["subscriptions"],
      responses: {
        200: {
          description: "Subscription details",
          content: {
            "application/json": {
              schema: resolver(subscriptionSchema),
            },
          },
        },
      },
    }),
    validator("param", getSubscriptionParamsSchema),
    async (c) => {
      const userId = await getUserId(c)
      if (userId instanceof Response) {
        return userId
      }

      const { id } = c.req.valid("param")
      const subscription = await getSubscriptionUseCase.execute(userId, id)
      return c.json(subscription, 200)
    },
  )

  // Update subscription
  app.put(
    `${API_PATHS.subscriptions}/:id`,
    describeRoute({
      summary: "Update subscription",
      tags: ["subscriptions"],
      responses: {
        200: {
          description: "Updated subscription",
          content: {
            "application/json": {
              schema: resolver(subscriptionSchema),
            },
          },
        },
      },
    }),
    validator("json", updateSubscriptionBodySchema),
    validator("param", updateSubscriptionParamsSchema),
    async (c) => {
      const userId = await getUserId(c)
      if (userId instanceof Response) {
        return userId
      }

      const { id } = c.req.valid("param")
      const payload = c.req.valid("json")
      const subscription = await updateSubscriptionUseCase.execute(
        userId,
        id,
        payload,
      )
      return c.json(subscription, 200)
    },
  )

  // Delete subscription
  app.delete(
    `${API_PATHS.subscriptions}/:id`,
    describeRoute({
      summary: "Delete subscription",
      tags: ["subscriptions"],
      responses: {
        204: {
          description: "Subscription deleted",
        },
      },
    }),
    validator("param", deleteSubscriptionParamsSchema),
    async (c) => {
      const userId = await getUserId(c)
      if (userId instanceof Response) {
        return userId
      }

      const { id } = c.req.valid("param")
      await deleteSubscriptionUseCase.execute(userId, id)
      return c.body(null, 204)
    },
  )
}
