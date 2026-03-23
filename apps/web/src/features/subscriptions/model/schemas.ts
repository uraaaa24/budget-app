import { z } from "zod"

export const subscriptionFormSchema = z.object({
  name: z.string().trim().min(1, "名前は必須です").max(100),
  amount: z.string().min(1, "金額は必須です"),
  currency: z.string().default("JPY"),
  billingCycle: z.enum(["monthly", "yearly", "weekly"]),
  startDate: z.date(),
  nextBillingDate: z.date(),
  status: z.enum(["active", "paused", "canceled"]),
  memo: z.string(),
  paymentMethod: z.string(),
})

export type SubscriptionFormSchema = z.infer<typeof subscriptionFormSchema>
