import * as v from "valibot"

export const transactionTypeSchema = v.picklist(["expense", "income"])
export type TransactionType = v.InferOutput<typeof transactionTypeSchema>

const isoDateTimeStringSchema = v.pipe(
  v.string(),
  v.check(
    (input) => !Number.isNaN(Date.parse(input)),
    "Invalid ISO date-time string",
  ),
)

export const createTransactionBodySchema = v.object({
  type: transactionTypeSchema,
  amount: v.pipe(v.number(), v.check((input) => input > 0)),
  category: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(50)),
  memo: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(200))),
  spentAt: isoDateTimeStringSchema,
})
export type CreateTransactionBody = v.InferOutput<typeof createTransactionBodySchema>

export const transactionSchema = v.object({
  ...createTransactionBodySchema.entries,
  id: v.pipe(v.string(), v.minLength(1)),
  userId: v.pipe(v.string(), v.minLength(1)),
  createdAt: isoDateTimeStringSchema,
  updatedAt: isoDateTimeStringSchema,
})
export type Transaction = v.InferOutput<typeof transactionSchema>

export const transactionListResponseSchema = v.object({
  items: v.array(transactionSchema),
})

export const updateTransactionBodySchema = v.object({
  type: transactionTypeSchema,
  amount: v.pipe(v.number(), v.check((input) => input > 0)),
  category: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(50)),
  memo: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(200))),
  spentAt: isoDateTimeStringSchema,
})
export type UpdateTransactionBody = v.InferOutput<typeof updateTransactionBodySchema>

export const updateTransactionParamsSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
})
export type UpdateTransactionParams = v.InferOutput<typeof updateTransactionParamsSchema>

export const deleteTransactionParamsSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
})
export type DeleteTransactionParams = v.InferOutput<typeof deleteTransactionParamsSchema>
