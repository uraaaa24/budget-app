import { serve } from "@hono/node-server";
import { env } from "@/core/env";
import { createApp } from "@/presentation/http/create-app";

const apiUrl = new URL(env.API_URL);
const port = Number(apiUrl.port || "3001");

serve({
  fetch: createApp().fetch,
  port,
});

console.log(`backend listening on ${env.API_URL}`);
