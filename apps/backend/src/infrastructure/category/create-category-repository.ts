import { env } from "@/core/env"
import type { CategoryRepository } from "@/domain/category/category-repository"
import { getDbClient } from "@/infrastructure/database/client"
import { DrizzleCategoryRepository } from "@/infrastructure/database/category/drizzle-category-repository"

export const createCategoryRepository = (): CategoryRepository => {
  const db = getDbClient(env.DATABASE_URL)
  return new DrizzleCategoryRepository(db)
}
