import { randomUUID } from "node:crypto";
import { Task, CreateTaskInput } from "../models/task";

// ---------------------------------------------------------------------------
// The repository is the data-access layer. We define an INTERFACE first, then
// an in-memory implementation. Why? So the service layer depends on the
// abstraction, not on a concrete database. This is "dependency inversion" and
// it's exactly what lets you (a) unit-test the service with a fake repo and
// (b) swap in SQLite later WITHOUT touching the service.
//
// Note every method is async (returns a Promise) even though the in-memory
// version is synchronous. That's deliberate: a real DB is async, so we shape
// the interface for the real world from day one.
// ---------------------------------------------------------------------------

export interface TaskRepository {
  create(input: CreateTaskInput): Promise<Task>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  update(task: Task): Promise<Task>;
}

export class InMemoryTaskRepository implements TaskRepository {
  // A Map keyed by id. Private = nobody outside this class can poke at it.
  private readonly tasks = new Map<string, Task>();

  async create(input: CreateTaskInput): Promise<Task> {
    const task: Task = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      prompt: input.prompt,
      status: "pending",
      result: null,
    };
    this.tasks.set(task.id, task);
    return task;
  }

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null;
  }

  async update(task: Task): Promise<Task> {
    this.tasks.set(task.id, task);
    return task;
  }
}

// ---------------------------------------------------------------------------
// DAY 4 EXERCISE — SQLite repository
// ---------------------------------------------------------------------------
// Create a `SqliteTaskRepository implements TaskRepository` using
// `better-sqlite3` (install: npm i better-sqlite3 && npm i -D @types/better-sqlite3).
// Because it implements the SAME interface, you can swap it into the service
// in src/app.ts and nothing else changes. That swap, with zero changes to the
// service, is a great thing to show an architect (Alan).
// ---------------------------------------------------------------------------
