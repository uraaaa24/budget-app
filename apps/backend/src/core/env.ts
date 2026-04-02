import type { Env } from "@/types/env"
import * as v from "valibot"

const EnvSchema = v.object({
  CLERK_SECRET_KEY: v.pipe(v.string(), v.minLength(1)),
  DATABASE_URL: v.pipe(v.string(), v.minLength(1)),
})
type AppEnv = v.InferOutput<typeof EnvSchema>

/**
 * Validates environment variables from Cloudflare Workers env binding
 */
export const validateEnv = (env: Env): AppEnv => {
  const envVars = {
    CLERK_SECRET_KEY: env.CLERK_SECRET_KEY,
    DATABASE_URL: env.DATABASE_URL,
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

  return parsedEnv.output
}
