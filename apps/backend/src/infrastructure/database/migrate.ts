/**
 * Database migration script
 * Applies migrations from the migrations folder to the database
 */
import { getDbClient } from "@/infrastructure/database/client"
import { config } from "dotenv"
import { migrate } from "drizzle-orm/libsql/migrator"

config()

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL
  const authToken = process.env.DATABASE_AUTH_TOKEN

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required")
  }

  console.log("🚀 Running migrations...")

  const db = getDbClient(databaseUrl, authToken)

  try {
    await migrate(db, {
      migrationsFolder: "./src/infrastructure/database/migrations",
    })
    console.log("✅ Migrations completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  }
}

runMigrations()
