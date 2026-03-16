import { z } from "zod"

export const transactionFormSchema = z.object({
  type: z.enum(["expense", "income"], {
    required_error: "Type is required",
  }),
  amount: z.string().refine(
    (val) => {
      const num = Number(val)
      return Number.isFinite(num) && num > 0
    },
    { message: "Amount must be a positive number" }
  ),
  category: z.string().min(1, "Category is required"),
  memo: z.string().max(200, "Memo must be 200 characters or less"),
  spentAt: z.date({
    required_error: "Date is required",
  }),
})

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>
