import { z } from "zod"

export const subscriptionFormSchema = z.object({
  name: z.string().trim().min(1, "名前は必須です").max(100),
  amount: z.string().min(1, "金額は必須です"),
  currency: z.string().default("JPY"),
  billingCycle: z.enum(["monthly", "yearly", "weekly"]),
  // Monthly: day of month (1-31)
  monthlyDay: z.number().min(1).max(31).optional(),
  // Yearly: month (1-12) and day (1-31)
  yearlyMonth: z.number().min(1).max(12).optional(),
  yearlyDay: z.number().min(1).max(31).optional(),
  // Weekly: day of week (0=Sunday, 6=Saturday)
  weeklyDay: z.number().min(0).max(6).optional(),
  status: z.enum(["active", "paused", "canceled"]),
  memo: z.string(),
  paymentMethod: z.string(),
})

export type SubscriptionFormSchema = z.infer<typeof subscriptionFormSchema>
