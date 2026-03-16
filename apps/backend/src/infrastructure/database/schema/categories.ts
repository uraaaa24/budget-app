import { DB_TABLES } from "@/infrastructure/database/schema/constants"
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

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

export const categories = pgTable(
  DB_TABLES.categories,
  {
    [CATEGORY_FIELDS.ID]: uuid("id").primaryKey().defaultRandom(),
    [CATEGORY_FIELDS.USER_ID]: text("user_id"),
    [CATEGORY_FIELDS.NAME]: text("name").notNull(),
    [CATEGORY_FIELDS.EMOJI]: text("emoji").notNull(),
    [CATEGORY_FIELDS.TYPE]: text("type", {
      enum: ["expense", "income"],
    }).notNull(),
    [CATEGORY_FIELDS.IS_DEFAULT]: boolean("is_default")
      .notNull()
      .default(false),
    [CATEGORY_FIELDS.CREATED_AT]: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    [CATEGORY_FIELDS.UPDATED_AT]: timestamp("updated_at", {
      withTimezone: true,
    })
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
