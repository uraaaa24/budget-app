import type {
  CreateSubscriptionInput,
  Subscription,
  SubscriptionListResponse,
  UpdateSubscriptionInput,
} from "@/features/subscriptions/model/types"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

export const createSubscription = async (
  input: CreateSubscriptionInput,
  token: string,
): Promise<Subscription> => {
  const response = await fetch(`${API_BASE_URL}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error("Failed to create subscription")
  }

  return response.json()
}

export const fetchSubscriptions = async (
  token: string,
): Promise<SubscriptionListResponse> => {
  const response = await fetch(`${API_BASE_URL}/subscriptions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions")
  }

  return response.json()
}

export const fetchSubscription = async (
  id: string,
  token: string,
): Promise<Subscription> => {
  const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch subscription")
  }

  return response.json()
}

export const updateSubscription = async (
  input: UpdateSubscriptionInput,
  token: string,
): Promise<Subscription> => {
  const { id, ...body } = input
  const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error("Failed to update subscription")
  }

  return response.json()
}

export const deleteSubscription = async (
  id: string,
  token: string,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete subscription")
  }
}
