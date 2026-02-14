import * as v from "valibot";

export const transactionTypeSchema = v.picklist(["expense", "income"]);
export type TransactionType = v.InferOutput<typeof transactionTypeSchema>;

export const createTransactionBodySchema = v.object({
  type: transactionTypeSchema,
  amount: v.pipe(v.number(), v.check((input) => input > 0)),
  category: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(50)),
  memo: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(200))),
  spentAt: v.pipe(v.string(), v.isoDateTime()),
});
export type CreateTransactionBody = v.InferOutput<typeof createTransactionBodySchema>;

export const transactionSchema = v.object({
  ...createTransactionBodySchema.entries,
  id: v.pipe(v.string(), v.minLength(1)),
  createdAt: v.pipe(v.string(), v.isoDateTime()),
});
export type Transaction = v.InferOutput<typeof transactionSchema>;

export const transactionListResponseSchema = v.object({
  items: v.array(transactionSchema),
});
