import "dotenv/config"
import * as v from "valibot"

const EnvSchema = v.object({
  EXPO_PUBLIC_API_BASE_URL: v.pipe(v.string(), v.url()),
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: v.pipe(v.string(), v.minLength(1)),
  EXPO_PUBLIC_SUPABASE_URL: v.pipe(v.string(), v.url()),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: v.pipe(v.string(), v.minLength(1)),
})
type AppEnv = v.InferOutput<typeof EnvSchema>

const createEnv = (): AppEnv => {
  const envVars = {
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
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
