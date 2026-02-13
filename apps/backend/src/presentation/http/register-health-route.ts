import type { Hono } from "hono";
import type { GetHealthUseCase } from "@/application/get-health-use-case.js";

export const registerHealthRoute = (
  app: Hono,
  getHealthUseCase: GetHealthUseCase,
) => {
  app.get("/health", async (c) => {
    const health = await getHealthUseCase.execute();
    return c.json(health);
  });
};
