import { env } from "@/core/env"
import { logger } from "@/core/logger"
import { createApp } from "@/presentation/http/create-app"
import { serve } from "@hono/node-server"

const apiUrl = new URL(env.API_URL)
const port = Number(apiUrl.port || "3001")

serve({
  fetch: createApp().fetch,
  port,
})

logger.info("backend_started", { apiUrl: env.API_URL, port })
