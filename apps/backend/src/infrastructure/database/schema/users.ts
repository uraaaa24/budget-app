import { DB_TABLES } from "@/infrastructure/database/schema/constants"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

const USER_FIELDS = {
  ID: "id",
  EMAIL: "email",
  NAME: "name",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const

export const users = sqliteTable(DB_TABLES.users, {
  [USER_FIELDS.ID]: text("id").primaryKey(),
  [USER_FIELDS.EMAIL]: text("email"),
  [USER_FIELDS.NAME]: text("name"),
  [USER_FIELDS.CREATED_AT]: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  [USER_FIELDS.UPDATED_AT]: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
})

export type UserRow = typeof users.$inferSelect
export type UserInsert = typeof users.$inferInsert
