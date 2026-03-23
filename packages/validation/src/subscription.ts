import * as v from "valibot"

export const subscriptionBillingCycleSchema = v.picklist([
  "monthly",
  "yearly",
  "weekly",
])
export type SubscriptionBillingCycle = v.InferOutput<
  typeof subscriptionBillingCycleSchema
>

export const subscriptionStatusSchema = v.picklist([
  "active",
  "paused",
  "canceled",
])
export type SubscriptionStatus = v.InferOutput<
  typeof subscriptionStatusSchema
>

const isoDateTimeStringSchema = v.pipe(
  v.string(),
  v.check(
    (input) => !Number.isNaN(Date.parse(input)),
    "Invalid ISO date-time string",
  ),
)

export const createSubscriptionBodySchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(100)),
  amount: v.pipe(v.number(), v.check((input) => input > 0)),
  currency: v.optional(
    v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(10)),
  ),
  billingCycle: subscriptionBillingCycleSchema,
  startDate: isoDateTimeStringSchema,
  nextBillingDate: isoDateTimeStringSchema,
  status: subscriptionStatusSchema,
  memo: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(500))),
  paymentMethod: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(50))),
  categoryId: v.optional(v.pipe(v.string(), v.minLength(1))),
})
export type CreateSubscriptionBody = v.InferOutput<
  typeof createSubscriptionBodySchema
>

export const subscriptionSchema = v.object({
  ...createSubscriptionBodySchema.entries,
  id: v.pipe(v.string(), v.minLength(1)),
  userId: v.pipe(v.string(), v.minLength(1)),
  createdAt: isoDateTimeStringSchema,
  updatedAt: isoDateTimeStringSchema,
  // Derived values
  monthlyAmount: v.number(),
  yearlyAmount: v.number(),
})
export type Subscription = v.InferOutput<typeof subscriptionSchema>

export const subscriptionListResponseSchema = v.object({
  items: v.array(subscriptionSchema),
  summary: v.object({
    activeCount: v.number(),
    pausedCount: v.number(),
    canceledCount: v.number(),
    monthlyTotal: v.number(),
    yearlyTotal: v.number(),
  }),
})

export const updateSubscriptionBodySchema = createSubscriptionBodySchema
export type UpdateSubscriptionBody = v.InferOutput<
  typeof updateSubscriptionBodySchema
>

export const updateSubscriptionParamsSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
})
export type UpdateSubscriptionParams = v.InferOutput<
  typeof updateSubscriptionParamsSchema
>

export const getSubscriptionParamsSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
})
export type GetSubscriptionParams = v.InferOutput<
  typeof getSubscriptionParamsSchema
>

export const deleteSubscriptionParamsSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
})
export type DeleteSubscriptionParams = v.InferOutput<
  typeof deleteSubscriptionParamsSchema
>
