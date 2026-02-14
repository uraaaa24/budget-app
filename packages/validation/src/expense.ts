import * as v from "valibot";

export const createExpenseBodySchema = v.object({
  amount: v.pipe(v.number(), v.check((input) => input > 0)),
  category: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(50)),
  memo: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(200))),
  spentAt: v.pipe(v.string(), v.isoDateTime()),
});

export const expenseSchema = v.object({
  ...createExpenseBodySchema.entries,
  id: v.pipe(v.string(), v.minLength(1)),
  createdAt: v.pipe(v.string(), v.isoDateTime()),
});

export const expenseListResponseSchema = v.object({
  items: v.array(expenseSchema),
});

export type CreateExpenseBody = v.InferOutput<typeof createExpenseBodySchema>;
export type Expense = v.InferOutput<typeof expenseSchema>;
