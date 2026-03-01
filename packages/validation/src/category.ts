import * as v from "valibot"
import { transactionTypeSchema } from "@repo/validation/transaction"

const isoDateTimeStringSchema = v.pipe(
  v.string(),
  v.check(
    (input) => !Number.isNaN(Date.parse(input)),
    "Invalid ISO date-time string",
  ),
)

export const createCategoryBodySchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(50)),
  emoji: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(8)),
  type: transactionTypeSchema,
})
export type CreateCategoryBody = v.InferOutput<typeof createCategoryBodySchema>

export const categorySchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  userId: v.optional(v.pipe(v.string(), v.minLength(1))),
  name: v.pipe(v.string(), v.minLength(1)),
  emoji: v.pipe(v.string(), v.minLength(1), v.maxLength(8)),
  type: transactionTypeSchema,
  isDefault: v.boolean(),
  createdAt: isoDateTimeStringSchema,
  updatedAt: isoDateTimeStringSchema,
})
export type Category = v.InferOutput<typeof categorySchema>

export const categoryListResponseSchema = v.object({
  items: v.array(categorySchema),
})
