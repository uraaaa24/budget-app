export const subscriptionQueryKeys = {
  all: () => ["subscriptions"] as const,
  list: () => [...subscriptionQueryKeys.all(), "list"] as const,
  detail: (id: string) => [...subscriptionQueryKeys.all(), "detail", id] as const,
}
