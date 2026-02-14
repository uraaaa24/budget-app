import type { Context } from "hono"
import { verifyToken } from "@clerk/backend"
import { env } from "@/core/env"

export const requireUserId = async (c: Context): Promise<string | Response> => {
  const authHeader = c.req.header("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  const token = authHeader.slice("Bearer ".length).trim()
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  try {
    const payload = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    })

    const userId = payload.sub
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    return userId
  } catch {
    return c.json({ error: "Unauthorized" }, 401)
  }
}
