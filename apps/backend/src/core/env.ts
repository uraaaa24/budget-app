import "dotenv/config"
import * as v from "valibot"

const EnvSchema = v.object({
  API_URL: v.pipe(v.string(), v.url()),
  SUPABASE_URL: v.optional(v.pipe(v.string(), v.url())),
  SUPABASE_SERVICE_ROLE_KEY: v.optional(v.string()),
})
type AppEnv = v.InferOutput<typeof EnvSchema>

const createEnv = (): AppEnv => {
  const envVars = {
    API_URL: process.env.API_URL,
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

  return parsedEnv.output ?? {}
}

export const env = createEnv()
