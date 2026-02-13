import { Hono } from "hono";
import { GetHealthUseCase } from "@/application/get-health-use-case.js";
import { SystemHealthRepository } from "@/infrastructure/system-health-repository.js";
import { registerHealthRoute } from "@/presentation/http/register-health-route.js";

export const createApp = () => {
  const app = new Hono();

  const healthRepository = new SystemHealthRepository();
  const getHealthUseCase = new GetHealthUseCase(healthRepository);

  registerHealthRoute(app, getHealthUseCase);

  return app;
};
