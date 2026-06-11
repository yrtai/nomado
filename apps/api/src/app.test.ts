import { describe, expect, it } from "vitest";
import request from "supertest";
import { HealthResponseSchema } from "@nomado/shared";
import { createApp } from "./app.js";

describe("GET /health", () => {
  it("returns 200 with a valid HealthResponse", async () => {
    const res = await request(createApp()).get("/health");

    expect(res.status).toBe(200);
    const parsed = HealthResponseSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
    expect(res.body.service).toBe("nomado-api");
  });
});

describe("unknown route", () => {
  it("returns 404 as problem+json", async () => {
    const res = await request(createApp()).get("/nope");

    expect(res.status).toBe(404);
    expect(res.headers["content-type"]).toContain("application/problem+json");
    expect(res.body.title).toBe("Not Found");
  });
});
