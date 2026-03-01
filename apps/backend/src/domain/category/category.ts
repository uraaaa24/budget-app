import type { TransactionType } from "@/domain/transaction/transaction"

export type Category = {
  id: string
  userId?: string
  name: string
  emoji: string
  type: TransactionType
  isDefault: boolean
  createdAt: string
  updatedAt: string
}
