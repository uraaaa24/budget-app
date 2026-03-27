import { createApp } from "@/presentation/http/create-app"
import type { Env } from "@/types/env"

/**
 * Cloudflare Workers entry point
 */
export default {
  fetch: (request: Request, env: Env) => {
    const app = createApp(env)
    return app.fetch(request, env)
  },
}
