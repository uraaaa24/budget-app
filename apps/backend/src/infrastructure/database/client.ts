import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "@/infrastructure/database/schema"

let client: PostgresJsDatabase<typeof schema> | null = null

export const getDbClient = (connectionString: string) => {
  if (!client) {
    const queryClient = postgres(connectionString)
    client = drizzle(queryClient, { schema })
  }
  return client
}

export type DbClient = PostgresJsDatabase<typeof schema>
