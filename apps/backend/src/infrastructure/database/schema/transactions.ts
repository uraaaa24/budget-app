import { DB_TABLES } from "@/infrastructure/database/schema/constants"
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

const TRANSACTION_FIELDS = {
  ID: "id",
  USER_ID: "userId",
  TYPE: "type",
  AMOUNT: "amount",
  CATEGORY: "category",
  MEMO: "memo",
  SPENT_AT: "spentAt",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const

export const transactions = sqliteTable(
  DB_TABLES.transactions,
  {
    [TRANSACTION_FIELDS.ID]: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    [TRANSACTION_FIELDS.USER_ID]: text("user_id").notNull(),
    [TRANSACTION_FIELDS.TYPE]: text("type", {
      enum: ["expense", "income"],
    }).notNull(),
    [TRANSACTION_FIELDS.AMOUNT]: real("amount").notNull(),
    [TRANSACTION_FIELDS.CATEGORY]: text("category").notNull(),
    [TRANSACTION_FIELDS.MEMO]: text("memo"),
    [TRANSACTION_FIELDS.SPENT_AT]: integer("spent_at", { mode: "timestamp" }).notNull(),
    [TRANSACTION_FIELDS.CREATED_AT]: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    [TRANSACTION_FIELDS.UPDATED_AT]: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("transactions_spent_at_idx").on(table.spentAt),
    index("transactions_created_at_idx").on(table.createdAt),
    index("transactions_user_id_idx").on(table.userId),
  ],
)

export type TransactionRow = typeof transactions.$inferSelect
export type TransactionInsert = typeof transactions.$inferInsert
