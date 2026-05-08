import { DB_TABLES } from "@/infrastructure/database/schema/constants"
import {
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core"

const CATEGORY_FIELDS = {
  ID: "id",
  USER_ID: "userId",
  NAME: "name",
  EMOJI: "emoji",
  TYPE: "type",
  IS_DEFAULT: "isDefault",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const

export const categories = sqliteTable(
  DB_TABLES.categories,
  {
    [CATEGORY_FIELDS.ID]: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    [CATEGORY_FIELDS.USER_ID]: text("user_id"),
    [CATEGORY_FIELDS.NAME]: text("name").notNull(),
    [CATEGORY_FIELDS.EMOJI]: text("emoji").notNull(),
    [CATEGORY_FIELDS.TYPE]: text("type", {
      enum: ["expense", "income"],
    }).notNull(),
    [CATEGORY_FIELDS.IS_DEFAULT]: integer("is_default", { mode: "boolean" })
      .notNull()
      .default(false),
    [CATEGORY_FIELDS.CREATED_AT]: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    [CATEGORY_FIELDS.UPDATED_AT]: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("categories_user_id_idx").on(table.userId),
    index("categories_type_idx").on(table.type),
    index("categories_created_at_idx").on(table.createdAt),
  ],
)

export type CategoryRow = typeof categories.$inferSelect
