import type { Hono } from "hono";
import { API_PATHS } from "@repo/validation/api-paths";
import { swaggerUI } from "@hono/swagger-ui";
import { describeRoute, openAPIRouteHandler } from "hono-openapi";

export const registerSystemRoutes = (app: Hono) => {
  app.get(
    API_PATHS.health,
    describeRoute({
      summary: "Health check",
      tags: ["system"],
      responses: {
        200: {
          description: "Service health response",
          content: {
            "text/plain": {
              schema: {
                type: "string",
                example: "OK",
              },
            },
          },
        },
      },
    }),
    (c) => c.text("OK"),
  );

  app.get(
    API_PATHS.doc,
    openAPIRouteHandler(app, {
      documentation: {
        openapi: "3.0.0",
        info: {
          title: "Budget API",
          version: "1.0.0",
          description: "Budget app backend API documentation",
        },
      },
      exclude: [API_PATHS.doc, API_PATHS.ui],
    }),
  );

  app.get(API_PATHS.ui, swaggerUI({ url: API_PATHS.doc }));
};
