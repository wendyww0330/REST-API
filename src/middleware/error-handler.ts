import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { NotFoundError } from "../services/task.service";

// ---------------------------------------------------------------------------
// Centralized error handler. Routes just `throw` (or call next(err)); this is
// the single place that decides the HTTP status. Interview talking point:
// don't scatter try/catch + res.status(...) across every route — funnel it.
//
// An Express error-handling middleware is identified by having FOUR args.
// ---------------------------------------------------------------------------
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "validation_failed",
      details: err.issues.map((i) => ({ path: i.path, message: i.message })),
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ error: "not_found", message: err.message });
    return;
  }

  // Anything else is an unexpected bug — log it, return a generic 500.
  // (Never leak internal error details to the client.)
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "internal_error" });
}
