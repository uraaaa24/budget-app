import { z } from "zod";

export const healthQuerySchema = z.object({
  details: z
    .enum(["true", "false"])
    .optional()
    .transform((value: "true" | "false" | undefined) => value === "true"),
});

export type HealthQuery = z.infer<typeof healthQuerySchema>;
