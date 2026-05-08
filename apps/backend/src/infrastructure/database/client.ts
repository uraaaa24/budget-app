import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import * as schema from "@/infrastructure/database/schema"

/**
 * Get database client for Cloudflare Workers
 * Uses Turso (libSQL) for edge-optimized SQLite
 */
export const getDbClient = (url: string, authToken?: string) => {
  const client = createClient({
    url,
    authToken,
  })
  return drizzle(client, { schema })
}

export type DbClient = ReturnType<typeof getDbClient>
