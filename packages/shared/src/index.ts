import { z } from "zod";

/**
 * Shared schemas live here. The api validates responses against them,
 * the web parses responses with them — one source of truth for both sides.
 * Pattern explained in docs/system-design.md §3.3.
 */

export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.string(),
  uptimeSeconds: z.number().nonnegative(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
