import { describe, it, expect, beforeEach } from "vitest";
import { TaskService, NotFoundError } from "../src/services/task.service";
import { InMemoryTaskRepository } from "../src/repositories/task.repository";

// ---------------------------------------------------------------------------
// UNIT tests: test the service in isolation. We give it a real in-memory repo
// here (it's already a perfect "fake"), so no mocking library is needed for
// these. For the Day 4 runTask tests you'll likely want to MOCK the tool —
// see the hint at the bottom.
//
// Pattern to memorize for the interview: Arrange / Act / Assert.
// ---------------------------------------------------------------------------

describe("TaskService", () => {
  let service: TaskService;

  // Fresh repo + service before EACH test → tests don't leak state into each
  // other. (Interview talking point: test isolation.)
  beforeEach(() => {
    service = new TaskService(new InMemoryTaskRepository());
  });

  it("creates a task in 'pending' status with no result", async () => {
    // Arrange + Act
    const task = await service.createTask({ prompt: "summarize this" });

    // Assert
    expect(task.id).toBeTypeOf("string");
    expect(task.prompt).toBe("summarize this");
    expect(task.status).toBe("pending");
    expect(task.result).toBeNull();
  });

  it("lists all created tasks", async () => {
    await service.createTask({ prompt: "a" });
    await service.createTask({ prompt: "b" });

    const tasks = await service.listTasks();

    expect(tasks).toHaveLength(2);
  });

  it("returns a task by id", async () => {
    const created = await service.createTask({ prompt: "find by id" });

    const found = await service.getTask(created.id);

    expect(found.id).toBe(created.id);
  });

  it("throws NotFoundError for an unknown id", async () => {
    // rejects.toThrowError is how you assert on a thrown async error.
    await expect(service.getTask("does-not-exist")).rejects.toThrowError(
      NotFoundError,
    );
  });

  // -------------------------------------------------------------------------
  // DAY 4 EXERCISE — write these THREE tests first (they'll fail = RED),
  // then implement runTask in the service until they pass (GREEN):
  //
  //   it("marks a task succeeded after running", async () => { ... })
  //   it("marks a task failed when the tool throws", async () => { ... })
  //   it("throws NotFoundError when running an unknown id", async () => { ... })
  //
  // To force the tool to fail deterministically, mock it at the top of the file:
  //   import { vi } from "vitest";
  //   vi.mock("../src/tools/mock-tool", () => ({
  //     runMockTool: vi.fn(),
  //   }));
  // then in the test: (runMockTool as Mock).mockRejectedValueOnce(new Error("boom"))
  // -------------------------------------------------------------------------
});
