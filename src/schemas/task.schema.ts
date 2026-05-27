import { z } from "zod";

// ---------------------------------------------------------------------------
// zod gives you runtime validation AND a TypeScript type from one definition.
// This is the bridge between "untrusted JSON from the network" and your
// strongly-typed domain. Interview talking point: types alone don't protect
// you at runtime — incoming request bodies must be validated.
// ---------------------------------------------------------------------------

export const createTaskSchema = z.object({
  prompt: z.string().min(1, "prompt must not be empty").max(500),
});

// Infer the TS type straight from the schema — single source of truth.
export type CreateTaskBody = z.infer<typeof createTaskSchema>;
