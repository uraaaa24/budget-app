export const transactionQueryKeys = {
  all: () => ["transactions"] as const,
  list: () => [...transactionQueryKeys.all(), "list"] as const,
  detail: (id: string) => [...transactionQueryKeys.all(), "detail", id] as const,
}

export const categoryQueryKeys = {
  all: () => ["categories"] as const,
  list: () => [...categoryQueryKeys.all(), "list"] as const,
  detail: (id: string) => [...categoryQueryKeys.all(), "detail", id] as const,
}
