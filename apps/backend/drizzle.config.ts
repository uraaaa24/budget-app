import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config()

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for drizzle-kit")
}

export default defineConfig({
  schema: "./src/infrastructure/database/schema/index.ts",
  out: "../../supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
