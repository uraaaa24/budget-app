import { DB_TABLES } from "@/infrastructure/database/schema/constants"
import {
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const transactions = pgTable(
  DB_TABLES.transactions,
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    type: text("type", { enum: ["expense", "income"] }).notNull(),
    amount: doublePrecision("amount").notNull(),
    category: text("category").notNull(),
    memo: text("memo"),
    spentAt: timestamp("spent_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("transactions_spent_at_idx").on(table.spentAt.desc()),
    index("transactions_created_at_idx").on(table.createdAt.desc()),
    index("transactions_user_id_idx").on(table.userId),
  ],
)

export type TransactionRow = typeof transactions.$inferSelect
export type TransactionInsert = typeof transactions.$inferInsert
