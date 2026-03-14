export type TransactionType = "expense" | "income"

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

export type Transaction = {
  id: string
  userId: string
  type: TransactionType
  amount: number
  category: string
  memo?: string
  spentAt: string
  createdAt: string
  updatedAt: string
}

export type TransactionFormValues = {
  type: TransactionType
  date: string
  amount: string
  category: string
  memo: string
}

export type CreateTransactionInput = {
  type: TransactionType
  amount: number
  category: string
  memo?: string
  spentAt: string
}

export type UpdateTransactionInput = {
  id: string
  type: TransactionType
  amount: number
  category: string
  memo?: string
  spentAt: string
}
