import express from "express";
import { HealthResponseSchema } from "@nomado/shared";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    // Validating our own response against the shared schema keeps
    // api and web honest with each other.
    const body = HealthResponseSchema.parse({
      status: "ok",
      service: "nomado-api",
      uptimeSeconds: Math.floor(process.uptime()),
    });
    res.json(body);
  });

  // Feature modules mount here as they are built (see src/modules/README.md):
  // app.use("/api/v1/auth", authRouter);
  // app.use("/api/v1/listings", listingsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
