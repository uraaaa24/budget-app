import type {
  Category,
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from "@/features/transactions/model/types"
import { fetchWithAuth, type AuthToken } from "@/lib/api"

export const fetchTransactions = async (token: AuthToken) => {
  const data = await fetchWithAuth<{ items: Transaction[] }>(
    "/transactions",
    token,
  )
  return data.items
}

export const fetchCategories = async (token: AuthToken) => {
  const data = await fetchWithAuth<{ items: Category[] }>("/categories", token)
  return data.items
}

export const createTransaction = async (
  input: CreateTransactionInput,
  token: AuthToken,
) => {
  return fetchWithAuth<Transaction>("/transactions", token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
}

export const updateTransaction = async (
  input: UpdateTransactionInput,
  token: AuthToken,
) => {
  return fetchWithAuth<Transaction>(`/transactions/${input.id}`, token, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
}

export const deleteTransaction = async (id: string, token: AuthToken) => {
  return fetchWithAuth<void>(`/transactions/${id}`, token, {
    method: "DELETE",
  })
}
