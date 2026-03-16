import type { CategoryRepository } from "@/domain/category/category-repository"

export class ListCategoriesUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(userId: string) {
    return this.repository.listAvailableByUser(userId)
  }
}
