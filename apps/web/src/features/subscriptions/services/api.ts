import type {
  CreateSubscriptionInput,
  Subscription,
  SubscriptionListResponse,
  UpdateSubscriptionInput,
} from "@/features/subscriptions/model/types"
import { fetchWithAuth, type AuthToken } from "@/lib/api"

export const createSubscription = async (
  input: CreateSubscriptionInput,
  token: AuthToken,
): Promise<Subscription> => {
  return fetchWithAuth<Subscription>("/subscriptions", token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
}

export const fetchSubscriptions = async (
  token: AuthToken,
): Promise<SubscriptionListResponse> => {
  return fetchWithAuth<SubscriptionListResponse>("/subscriptions", token)
}

export const fetchSubscription = async (
  id: string,
  token: AuthToken,
): Promise<Subscription> => {
  return fetchWithAuth<Subscription>(`/subscriptions/${id}`, token)
}

export const updateSubscription = async (
  input: UpdateSubscriptionInput,
  token: AuthToken,
): Promise<Subscription> => {
  const { id, ...body } = input
  return fetchWithAuth<Subscription>(`/subscriptions/${id}`, token, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

export const deleteSubscription = async (
  id: string,
  token: AuthToken,
): Promise<void> => {
  await fetchWithAuth<void>(`/subscriptions/${id}`, token, {
    method: "DELETE",
  })
}
