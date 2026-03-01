import type { Category } from "@/domain/category/category"
import type {
  CategoryRepository,
  CreateCategoryInput,
} from "@/domain/category/category-repository"
import type { DbClient } from "@/infrastructure/database/client"
import {
  categories,
  type CategoryRow,
} from "@/infrastructure/database/schema/categories"
import { asc, eq, isNull, or } from "drizzle-orm"

export class DrizzleCategoryRepository implements CategoryRepository {
  constructor(private readonly db: DbClient) {}

  async create(userId: string, input: CreateCategoryInput): Promise<Category> {
    const [row] = await this.db
      .insert(categories)
      .values({
        userId,
        name: input.name,
        emoji: input.emoji,
        type: input.type,
        isDefault: false,
        updatedAt: new Date(),
      })
      .returning()

    if (!row) {
      throw new Error("Failed to create category")
    }

    return toDomainCategory(row)
  }

  async listAvailableByUser(userId: string): Promise<Category[]> {
    const rows = await this.db
      .select()
      .from(categories)
      .where(or(eq(categories.userId, userId), isNull(categories.userId)))
      .orderBy(asc(categories.name))

    const deduped = new Map<string, CategoryRow>()
    for (const row of rows) {
      const key = `${row.type}:${row.name.trim().toLowerCase()}`
      const existing = deduped.get(key)
      if (!existing) {
        deduped.set(key, row)
        continue
      }

      // If same category exists in both default and user rows, prefer user row.
      if (existing.userId === null && row.userId === userId) {
        deduped.set(key, row)
      }
    }

    return Array.from(deduped.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(toDomainCategory)
  }
}

const toDomainCategory = (row: CategoryRow): Category => ({
  id: row.id,
  userId: row.userId ?? undefined,
  name: row.name,
  emoji: row.emoji,
  type: row.type,
  isDefault: row.isDefault,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
})
