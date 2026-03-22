import { z } from "zod"

export const transactionFormSchema = z.object({
  type: z.enum(["expense", "income"], {
    message: "収入か支出を選んでください",
  }),
  amount: z.string().refine(
    (val) => {
      const num = Number(val)
      return Number.isFinite(num) && num > 0
    },
    { message: "金額を入力してください" },
  ),
  category: z.string().min(1, "カテゴリを選んでください"),
  memo: z.string().max(200, "メモは200文字以内でお願いします"),
  spentAt: z
    .date({
      message: "日付を選んでください",
    })
    .refine(
      (date) => {
        const today = new Date()
        today.setHours(23, 59, 59, 999)
        return date <= today
      },
      { message: "未来の日付は選べません" },
    ),
})

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>
