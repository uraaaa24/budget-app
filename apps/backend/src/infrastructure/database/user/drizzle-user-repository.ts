import type { User } from "@/domain/user/user"
import type { UserRepository } from "@/domain/user/user-repository"
import type { LibSQLDatabase } from "drizzle-orm/libsql"
import { eq } from "drizzle-orm"
import * as schema from "@/infrastructure/database/schema"

export class DrizzleUserRepository implements UserRepository {
  constructor(private db: LibSQLDatabase<typeof schema>) {}

  async findById(id: string): Promise<User | null> {
    const rows = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1)

    const row = rows[0]
    if (!row) return null

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }

  async create(user: User): Promise<void> {
    await this.db.insert(schema.users).values({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }
}
