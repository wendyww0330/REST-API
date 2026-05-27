import { Task, CreateTaskInput } from "../models/task";
import { TaskRepository } from "../repositories/task.repository";
import { runMockTool } from "../tools/mock-tool";

// ---------------------------------------------------------------------------
// A typed error so the route layer (and error handler) can tell "not found"
// apart from a real bug. Interview talking point: don't signal "not found"
// with a magic null all the way up — model it.
// ---------------------------------------------------------------------------
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

// ---------------------------------------------------------------------------
// The service holds business logic. It depends on the TaskRepository
// INTERFACE (constructor injection) — never on a concrete DB. That's what
// makes it trivially unit-testable with a fake repo. See tests/.
// ---------------------------------------------------------------------------
export class TaskService {
  constructor(private readonly repo: TaskRepository) {}

  async createTask(input: CreateTaskInput): Promise<Task> {
    return this.repo.create(input);
  }

  async listTasks(): Promise<Task[]> {
    return this.repo.findAll();
  }

  async getTask(id: string): Promise<Task> {
    const task = await this.repo.findById(id);
    if (!task) {
      throw new NotFoundError(`task ${id} not found`);
    }
    return task;
  }

  // -------------------------------------------------------------------------
  // DAY 4 EXERCISE — implement runTask, ideally TEST-FIRST (write the test in
  // tests/task.service.test.ts before you write this body).
  //
  // Steps to implement:
  //   1. const task = await this.getTask(id)          // reuse, get 404 for free
  //   2. task.status = "running"; await this.repo.update(task)
  //   3. try { const r = await runMockTool(task.prompt)
  //            task.status = "succeeded"; task.result = r.output }
  //      catch (e) { task.status = "failed"; task.result = String(e) }
  //   4. return this.repo.update(task)
  //
  // Tests to write first:
  //   - happy path: status becomes "succeeded", result is set
  //   - tool failure: mock runMockTool to throw, assert status "failed"
  //   - unknown id: assert it throws NotFoundError
  // -------------------------------------------------------------------------
  async runTask(_id: string): Promise<Task> {
    throw new Error("NOT IMPLEMENTED — this is your Day 4 exercise");
  }
}
