import { API_PATHS } from '@repo/validation/api-paths'
import type {
  Category,
  CreateTransactionInput,
  Transaction,
} from '@/features/dashboard/model/types'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3001'

type AuthToken = string

export const fetchTransactions = async (token: AuthToken) => {
  const response = await fetch(`${API_BASE_URL}${API_PATHS.transactions}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(
      detail
        ? `Failed to load transactions: ${response.status} ${detail}`
        : `Failed to load transactions: ${response.status}`,
    )
  }

  const data = (await response.json()) as { items: Transaction[] }
  return data.items
}

export const fetchCategories = async (token: AuthToken) => {
  const response = await fetch(`${API_BASE_URL}${API_PATHS.categories}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(
      detail
        ? `Failed to load categories: ${response.status} ${detail}`
        : `Failed to load categories: ${response.status}`,
    )
  }

  const data = (await response.json()) as { items: Category[] }
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
    const detail = await response.text().catch(() => '')
    throw new Error(
      detail
        ? `Failed to create transaction: ${response.status} ${detail}`
        : `Failed to create transaction: ${response.status}`,
    )
  }

  return (await response.json()) as Transaction
}
