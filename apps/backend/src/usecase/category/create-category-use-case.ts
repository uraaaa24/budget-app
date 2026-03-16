import type {
  CategoryRepository,
  CreateCategoryInput,
} from "@/domain/category/category-repository"

export class CreateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(userId: string, input: CreateCategoryInput) {
    return this.repository.create(userId, input)
  }
}
