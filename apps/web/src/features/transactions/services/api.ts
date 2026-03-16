import type {
  Category,
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from "@/features/transactions/model/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001"

type AuthToken = string

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchWithAuth<T>(
  path: string,
  token: AuthToken,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    throw new ApiError(
      `API request failed: ${response.status}`,
      response.status,
      detail
    )
  }

  return response.json() as Promise<T>
}

export const fetchTransactions = async (token: AuthToken) => {
  const data = await fetchWithAuth<{ items: Transaction[] }>(
    "/api/transactions",
    token
  )
  return data.items
}

export const fetchCategories = async (token: AuthToken) => {
  const data = await fetchWithAuth<{ items: Category[] }>(
    "/api/categories",
    token
  )
  return data.items
}

export const createTransaction = async (
  input: CreateTransactionInput,
  token: AuthToken
) => {
  return fetchWithAuth<Transaction>("/api/transactions", token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
}

export const updateTransaction = async (
  input: UpdateTransactionInput,
  token: AuthToken
) => {
  return fetchWithAuth<Transaction>(`/api/transactions/${input.id}`, token, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
}

export const deleteTransaction = async (id: string, token: AuthToken) => {
  return fetchWithAuth<void>(`/api/transactions/${id}`, token, {
    method: "DELETE",
  })
}
