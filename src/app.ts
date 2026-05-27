import express, { Express } from "express";
import { InMemoryTaskRepository } from "./repositories/task.repository";
import { TaskService } from "./services/task.service";
import { createTaskRouter } from "./routes/tasks.routes";
import { errorHandler } from "./middleware/error-handler";

// ---------------------------------------------------------------------------
// buildApp wires everything together (composition root). We separate this from
// index.ts on purpose: tests import buildApp() and hit it with supertest
// WITHOUT opening a real network port. This separation is a common,
// interview-worthy pattern.
//
// To swap to SQLite later , change ONE line below: new the SQLite repo
// instead of the in-memory one. The service and routes don't change at all.
// ---------------------------------------------------------------------------
export function buildApp(): Express {
  const app = express();
  app.use(express.json());

  // --- dependency wiring ---
  const repo = new InMemoryTaskRepository();
  const service = new TaskService(repo);

  // --- health check (every cloud-native service needs one) ---
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // --- feature routes ---
  app.use("/tasks", createTaskRouter(service));

  // --- error handler MUST be registered last ---
  app.use(errorHandler);

  return app;
}
