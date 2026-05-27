import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { buildApp } from "../src/app";

// ---------------------------------------------------------------------------
// INTEGRATION tests: drive the whole app through real HTTP requests with
// supertest — routing, validation, service, repo, error handler all together.
// No port is opened; supertest talks to the app object directly.
//
// Interview talking point: unit tests (fast, isolated, lots of them) vs
// integration tests (fewer, slower, prove the pieces fit). You want both.
// ---------------------------------------------------------------------------

describe("tasks routes", () => {
  let app: Express;

  beforeEach(() => {
    app = buildApp();
  });

  it("POST /tasks creates a task and returns 201", async () => {
    const res = await request(app).post("/tasks").send({ prompt: "hello" });

    expect(res.status).toBe(201);
    expect(res.body.prompt).toBe("hello");
    expect(res.body.status).toBe("pending");
  });

  it("POST /tasks returns 400 on invalid body", async () => {
    const res = await request(app).post("/tasks").send({ prompt: "" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("validation_failed");
  });

  it("GET /tasks lists created tasks", async () => {
    await request(app).post("/tasks").send({ prompt: "one" });
    const res = await request(app).get("/tasks");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("GET /tasks/:id returns 404 for unknown id", async () => {
    const res = await request(app).get("/tasks/nope");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("not_found");
  });

  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
