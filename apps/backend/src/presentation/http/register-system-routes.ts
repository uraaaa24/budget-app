import type { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";

const openApiDoc = {
  openapi: "3.0.0",
  info: {
    title: "Budget API",
    version: "1.0.0",
    description: "Budget app backend API documentation",
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
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
      },
    },
    "/expenses": {
      get: {
        summary: "List expenses",
        responses: {
          "200": {
            description: "Expense list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Expense",
                      },
                    },
                  },
                  required: ["items"],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create expense",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateExpenseBody",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Created expense",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Expense",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateExpenseBody: {
        type: "object",
        properties: {
          amount: { type: "number", exclusiveMinimum: 0 },
          category: { type: "string", minLength: 1, maxLength: 50 },
          memo: { type: "string", maxLength: 200 },
          spentAt: { type: "string", format: "date-time" },
        },
        required: ["amount", "category", "spentAt"],
      },
      Expense: {
        allOf: [
          { $ref: "#/components/schemas/CreateExpenseBody" },
          {
            type: "object",
            properties: {
              id: { type: "string", minLength: 1 },
              createdAt: { type: "string", format: "date-time" },
            },
            required: ["id", "createdAt"],
          },
        ],
      },
    },
  },
} as const;

export const registerSystemRoutes = (app: Hono) => {
  app.get("/doc", (c) => c.json(openApiDoc));
  app.get("/ui", swaggerUI({ url: "/doc" }));
  app.get("/health", (c) => c.text("OK"));
};
