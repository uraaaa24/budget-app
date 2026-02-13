import type { Hono } from "hono";
import type { GetHealthUseCase } from "@/application/get-health-use-case.js";
import { healthQuerySchema } from "@repo/validation/health";

export const registerHealthRoute = (
  app: Hono,
  getHealthUseCase: GetHealthUseCase,
) => {
  app.get("/health", async (c) => {
    const queryResult = healthQuerySchema.safeParse(c.req.query());

    if (!queryResult.success) {
      return c.json(
        {
          error: "Invalid query parameters",
          issues: queryResult.error.issues,
        },
        400,
      );
    }

    const health = await getHealthUseCase.execute();
    if (queryResult.data.details) {
      return c.json({
        ...health,
        details: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    return c.json(health);
  });
};
