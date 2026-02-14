export type TransactionType = 'expense' | 'income'

export type Transaction = {
  id: string
  userId: string
  type: TransactionType
  amount: number
  category: string
  memo?: string
  spentAt: string
  createdAt: string
}

export type TransactionFormValues = {
  type: TransactionType
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
