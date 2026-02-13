import { serve } from "@hono/node-server";
import { createApp } from "@/presentation/http/create-app.js";

const port = Number(process.env.PORT ?? 3001);

serve({
  fetch: createApp().fetch,
  port,
});

console.log(`backend listening on http://localhost:${port}`);
