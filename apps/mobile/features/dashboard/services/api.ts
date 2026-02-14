import { API_PATHS } from '@repo/validation/api-paths'
import type { CreateTransactionInput, Transaction } from '@/features/dashboard/model/types'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3001'

type AuthToken = string

export const fetchTransactions = async (token: AuthToken) => {
  const response = await fetch(`${API_BASE_URL}${API_PATHS.transactions}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to load transactions')
  }

  const data = (await response.json()) as { items: Transaction[] }
  return data.items
}

export const createTransaction = async (
  input: CreateTransactionInput,
  token: AuthToken,
) => {
  const response = await fetch(`${API_BASE_URL}${API_PATHS.transactions}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error('Failed to create transaction')
  }

  return (await response.json()) as Transaction
}
