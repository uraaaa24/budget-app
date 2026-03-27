import type { CategoryRepository } from "@/domain/category/category-repository"
import { getDbClient } from "@/infrastructure/database/client"
import { DrizzleCategoryRepository } from "@/infrastructure/database/category/drizzle-category-repository"

export const createCategoryRepository = (
  databaseUrl: string,
): CategoryRepository => {
  const db = getDbClient(databaseUrl)
  return new DrizzleCategoryRepository(db)
}
