import { z } from "zod";

export const createExpenseBodySchema = z.object({
  amount: z.number().positive(),
  category: z.string().trim().min(1).max(50),
  memo: z.string().trim().max(200).optional(),
  spentAt: z.string().datetime(),
});

export const expenseSchema = createExpenseBodySchema.extend({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type CreateExpenseBody = z.infer<typeof createExpenseBodySchema>;
export type Expense = z.infer<typeof expenseSchema>;
