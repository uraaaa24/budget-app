import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "@/infrastructure/database/schema"

let client: NeonHttpDatabase<typeof schema> | null = null

/**
 * Get database client for Cloudflare Workers
 * Uses HTTP-based connection via @neondatabase/serverless
 * Compatible with Supabase and other PostgreSQL providers
 */
export const getDbClient = (connectionString: string) => {
  if (!client) {
    const sql = neon(connectionString)
    client = drizzle(sql, { schema })
  }
  return client
}

export type DbClient = NeonHttpDatabase<typeof schema>
