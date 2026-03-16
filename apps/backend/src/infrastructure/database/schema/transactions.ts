import { DB_TABLES } from "@/infrastructure/database/schema/constants"
import {
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

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

export const transactions = pgTable(
  DB_TABLES.transactions,
  {
    [TRANSACTION_FIELDS.ID]: uuid("id").primaryKey().defaultRandom(),
    [TRANSACTION_FIELDS.USER_ID]: text("user_id").notNull(),
    [TRANSACTION_FIELDS.TYPE]: text("type", {
      enum: ["expense", "income"],
    }).notNull(),
    [TRANSACTION_FIELDS.AMOUNT]: doublePrecision("amount").notNull(),
    [TRANSACTION_FIELDS.CATEGORY]: text("category").notNull(),
    [TRANSACTION_FIELDS.MEMO]: text("memo"),
    [TRANSACTION_FIELDS.SPENT_AT]: timestamp("spent_at", {
      withTimezone: true,
    }).notNull(),
    [TRANSACTION_FIELDS.CREATED_AT]: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    [TRANSACTION_FIELDS.UPDATED_AT]: timestamp("updated_at", {
      withTimezone: true,
    })
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
