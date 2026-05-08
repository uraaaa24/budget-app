import { getDbClient } from "@/infrastructure/database/client"
import { DrizzleUserRepository } from "@/infrastructure/database/user/drizzle-user-repository"

export const createUserRepository = (url: string, authToken?: string) => {
  const db = getDbClient(url, authToken)
  return new DrizzleUserRepository(db)
}
