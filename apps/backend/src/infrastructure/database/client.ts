import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "@/infrastructure/database/schema"

/**
 * Get database client for Cloudflare Workers
 * Uses postgres-js with Supabase Connection Pooler (Transaction mode)
 */
export const getDbClient = (connectionString: string) => {
  const client = postgres(connectionString, {
    prepare: false, // Required for Connection Pooler in transaction mode
    max: 1, // Cloudflare Workers: single connection per request
  })
  return drizzle(client, { schema })
}

export type DbClient = ReturnType<typeof getDbClient>
