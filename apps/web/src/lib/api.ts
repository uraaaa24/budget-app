export type AuthToken = string

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  "http://localhost:8787"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function fetchWithAuth<T>(
  path: string,
  token: AuthToken,
  options?: RequestInit,
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
      detail,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
