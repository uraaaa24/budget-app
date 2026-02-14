import type { Category } from "@/domain/category/category"
import type { TransactionType } from "@/domain/transaction/transaction"

export type CreateCategoryInput = {
  name: string
  type: TransactionType
}

export type CategoryRepository = {
  create(userId: string, input: CreateCategoryInput): Promise<Category>
  listAvailableByUser(userId: string): Promise<Category[]>
}
