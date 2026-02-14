import type { Context } from "hono"

export type GetUserId = (c: Context) => Promise<string | Response>
