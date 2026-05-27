import { Router, Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import { createTaskSchema } from "../schemas/task.schema";

// ---------------------------------------------------------------------------
// Routes are a THIN layer. They: (1) validate input, (2) call the service,
// (3) shape the HTTP response. No business logic here. Notice each handler is
// wrapped so async errors get forwarded to the error handler via next(err).
// ---------------------------------------------------------------------------

// Small helper: Express 4 doesn't auto-catch errors from async handlers, so we
// wrap them. (Interview bonus: explain WHY this exists — a rejected promise in
// an async route otherwise becomes an unhandled rejection, not a 500.)
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export function createTaskRouter(service: TaskService): Router {
  const router = Router();

  // POST /tasks — create a task
  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const body = createTaskSchema.parse(req.body); // throws ZodError -> 400
      const task = await service.createTask(body);
      res.status(201).json(task);
    }),
  );

  // GET /tasks — list all tasks
  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const tasks = await service.listTasks();
      res.json(tasks);
    }),
  );

  // GET /tasks/:id — get one task (404 if missing, via NotFoundError)
  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const task = await service.getTask(req.params.id);
      res.json(task);
    }),
  );

  // POST /tasks/:id/run — run the task (DAY 4: works once you implement runTask)
  router.post(
    "/:id/run",
    asyncHandler(async (req, res) => {
      const task = await service.runTask(req.params.id);
      res.json(task);
    }),
  );

  return router;
}
