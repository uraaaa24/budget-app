import { logger } from "@/core/logger"
import type { GetUserId } from "@/presentation/http/auth/get-user-id"
import type { EnsureUserExistsUseCase } from "@/usecase/user/ensure-user-exists-use-case"
import { createClerkClient, verifyToken } from "@clerk/backend"
import type { Context } from "hono"

const getRequestMeta = (c: Context) => ({
  method: c.req.method,
  path: c.req.path,
  requestId: c.req.header("x-request-id") ?? null,
})

const logUnauthorized = (
  c: Context,
  reason: string,
  extra: Record<string, unknown> = {},
) => {
  logger.warn("auth_unauthorized", {
    ...getRequestMeta(c),
    reason,
    ...extra,
  })
}

export const createRequireUserId = (
  clerkSecretKey: string,
  ensureUserExistsUseCase: EnsureUserExistsUseCase,
): GetUserId => {
  const clerkClient = createClerkClient({ secretKey: clerkSecretKey })

  return async (c: Context): Promise<string | Response> => {
    const authHeader = c.req.header("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logUnauthorized(c, "missing_or_invalid_authorization_header", {
        hasAuthorizationHeader: Boolean(authHeader),
      })
      return c.json({ error: "Unauthorized" }, 401)
    }

    const token = authHeader.slice("Bearer ".length).trim()
    if (!token) {
      logUnauthorized(c, "empty_bearer_token")
      return c.json({ error: "Unauthorized" }, 401)
    }

    try {
      const payload = await verifyToken(token, {
        secretKey: clerkSecretKey,
      })

      const userId = payload.sub
      if (!userId) {
        logUnauthorized(c, "token_without_sub")
        return c.json({ error: "Unauthorized" }, 401)
      }

      // Fetch user info from Clerk to get email and name
      try {
        const user = await clerkClient.users.getUser(userId)

        // Ensure user exists in database, create if not
        await ensureUserExistsUseCase.execute({
          userId,
          email: user.emailAddresses[0]?.emailAddress,
          name:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`.trim()
              : user.firstName || user.lastName || undefined,
        })
      } catch (userFetchError) {
        logger.warn("clerk_user_fetch_failed", {
          userId,
          errorMessage:
            userFetchError instanceof Error
              ? userFetchError.message
              : String(userFetchError),
        })

        // Still create user even if Clerk API fails, just without email/name
        await ensureUserExistsUseCase.execute({
          userId,
        })
      }

      return userId
    } catch (error) {
      logUnauthorized(c, "token_verification_failed", {
        errorName: error instanceof Error ? error.name : "UnknownError",
        errorMessage: error instanceof Error ? error.message : String(error),
      })
      return c.json({ error: "Unauthorized" }, 401)
    }
  }
}
