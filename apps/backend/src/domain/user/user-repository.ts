import type { User } from "@/domain/user/user"

export interface UserRepository {
  findById(id: string): Promise<User | null>
  create(user: User): Promise<void>
}
