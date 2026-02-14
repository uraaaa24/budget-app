import type { Hono } from "hono"
import { API_PATHS } from "@repo/validation/api-paths"
import {
  categoryListResponseSchema,
  categorySchema,
  createCategoryBodySchema,
} from "@repo/validation/category"
import { describeRoute, resolver, validator } from "hono-openapi"
import type { CreateCategoryUseCase } from "@/application/category/create-category-use-case"
import type { ListCategoriesUseCase } from "@/application/category/list-categories-use-case"
import type { GetUserId } from "@/presentation/http/auth/get-user-id"

export const registerCategoryRoutes = (
  app: Hono,
  createCategoryUseCase: CreateCategoryUseCase,
  listCategoriesUseCase: ListCategoriesUseCase,
  getUserId: GetUserId,
) => {
  app.post(
    API_PATHS.categories,
    describeRoute({
      summary: "Create category",
      tags: ["categories"],
      responses: {
        201: {
          description: "Created category",
          content: {
            "application/json": {
              schema: resolver(categorySchema),
            },
          },
        },
      },
    }),
    validator("json", createCategoryBodySchema),
    async (c) => {
      const userId = await getUserId(c)
      if (userId instanceof Response) {
        return userId
      }

      const payload = c.req.valid("json")
      const category = await createCategoryUseCase.execute(userId, payload)
      return c.json(category, 201)
    },
  )

  app.get(
    API_PATHS.categories,
    describeRoute({
      summary: "List categories",
      tags: ["categories"],
      responses: {
        200: {
          description: "Category list",
          content: {
            "application/json": {
              schema: resolver(categoryListResponseSchema),
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

      const categories = await listCategoriesUseCase.execute(userId)
      return c.json({ items: categories })
    },
  )
}
