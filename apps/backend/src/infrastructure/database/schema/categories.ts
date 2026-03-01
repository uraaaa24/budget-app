import { DB_TABLES } from "@/infrastructure/database/schema/constants"
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const categories = pgTable(
  DB_TABLES.categories,
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id"),
    name: text("name").notNull(),
    emoji: text("emoji").notNull(),
    type: text("type", { enum: ["expense", "income"] }).notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("categories_user_id_idx").on(table.userId),
    index("categories_type_idx").on(table.type),
    index("categories_created_at_idx").on(table.createdAt.desc()),
  ],
)

export type CategoryRow = typeof categories.$inferSelect
