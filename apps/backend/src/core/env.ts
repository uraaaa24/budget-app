import "dotenv/config"
import * as v from "valibot"

const EnvSchema = v.object({
  API_URL: v.pipe(v.string(), v.url()),
  CLERK_SECRET_KEY: v.pipe(v.string(), v.minLength(1)),
  SUPABASE_URL: v.optional(v.pipe(v.string(), v.url())),
  SUPABASE_SERVICE_ROLE_KEY: v.optional(v.string()),
})
type AppEnv = v.InferOutput<typeof EnvSchema>

const createEnv = (): AppEnv => {
  const envVars = {
    API_URL: process.env.API_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  const parsedEnv = v.safeParse(EnvSchema, envVars)

  if (!parsedEnv.success) {
    const flat = v.flatten(parsedEnv.issues)
    const lines = Object.entries(flat.nested ?? {}).map(
      ([k, msgs]) => `- ${k}: ${msgs?.join(", ")}`,
    )

    if (flat.root?.length) lines.unshift(`- (root): ${flat.root.join(", ")}`)
    if (flat.other?.length) lines.push(`- (other): ${flat.other.join(", ")}`)

    throw new Error(
      `Invalid env provided. The following variables are missing or invalid:\n${lines.join("\n")}`,
    )
  }

  const hasSupabaseUrl = Boolean(parsedEnv.output.SUPABASE_URL)
  const hasSupabaseServiceRole = Boolean(parsedEnv.output.SUPABASE_SERVICE_ROLE_KEY)
  if (hasSupabaseUrl !== hasSupabaseServiceRole) {
    throw new Error(
      "Invalid env provided. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set together.",
    )
  }

  return parsedEnv.output
}

export const env = createEnv()
