import { DB_TABLES } from "@/infrastructure/database/schema/constants"
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

const SUBSCRIPTION_FIELDS = {
  ID: "id",
  USER_ID: "userId",
  NAME: "name",
  AMOUNT: "amount",
  CURRENCY: "currency",
  BILLING_CYCLE: "billingCycle",
  START_DATE: "startDate",
  NEXT_BILLING_DATE: "nextBillingDate",
  STATUS: "status",
  MEMO: "memo",
  PAYMENT_METHOD: "paymentMethod",
  CATEGORY_ID: "categoryId",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const

export const subscriptions = sqliteTable(
  DB_TABLES.subscriptions,
  {
    [SUBSCRIPTION_FIELDS.ID]: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    [SUBSCRIPTION_FIELDS.USER_ID]: text("user_id").notNull(),
    [SUBSCRIPTION_FIELDS.NAME]: text("name").notNull(),
    [SUBSCRIPTION_FIELDS.AMOUNT]: real("amount").notNull(),
    [SUBSCRIPTION_FIELDS.CURRENCY]: text("currency").notNull().default("JPY"),
    [SUBSCRIPTION_FIELDS.BILLING_CYCLE]: text("billing_cycle", {
      enum: ["monthly", "yearly", "weekly"],
    }).notNull(),
    [SUBSCRIPTION_FIELDS.START_DATE]: integer("start_date", {
      mode: "timestamp",
    }).notNull(),
    [SUBSCRIPTION_FIELDS.NEXT_BILLING_DATE]: integer("next_billing_date", {
      mode: "timestamp",
    }).notNull(),
    [SUBSCRIPTION_FIELDS.STATUS]: text("status", {
      enum: ["active", "paused", "canceled"],
    }).notNull(),
    [SUBSCRIPTION_FIELDS.MEMO]: text("memo"),
    [SUBSCRIPTION_FIELDS.PAYMENT_METHOD]: text("payment_method"),
    [SUBSCRIPTION_FIELDS.CATEGORY_ID]: text("category_id"),
    [SUBSCRIPTION_FIELDS.CREATED_AT]: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    [SUBSCRIPTION_FIELDS.UPDATED_AT]: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_status_idx").on(table.status),
    index("subscriptions_next_billing_date_idx").on(table.nextBillingDate),
    index("subscriptions_created_at_idx").on(table.createdAt),
  ],
)

export type SubscriptionRow = typeof subscriptions.$inferSelect
export type SubscriptionInsert = typeof subscriptions.$inferInsert
