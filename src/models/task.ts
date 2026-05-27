// ---------------------------------------------------------------------------
// The domain model. This is where you learn TypeScript's type system.
// `type` aliases for unions, `interface` for object shapes — both shown here
// on purpose so you can talk about the difference in the interview.
// ---------------------------------------------------------------------------

// A union type: a Task can only ever be in one of these four states.
// (Interview talking point: this is "narrowing" — the compiler forces you
//  to handle each case.)
export type TaskStatus = "pending" | "running" | "succeeded" | "failed";

// The shape of a task as it lives in our system.
// `readonly` on id/createdAt signals these never change after creation.
export interface Task {
  readonly id: string;
  readonly createdAt: string; // ISO timestamp
  prompt: string; // what we want the "agent" to do
  status: TaskStatus;
  result: string | null; // filled in after the task runs
}


// The data needed to *create* a task — note it's a subset of Task.
// `Pick` is a built-in utility type. Interview talking point: you didn't
// repeat yourself, you derived this type from Task.
export type CreateTaskInput = Pick<Task, "prompt">;

