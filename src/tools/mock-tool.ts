// ---------------------------------------------------------------------------
// A FAKE "tool" that an agent might call. In a real agent harness this would
// be an LLM call, a database query, an external API, etc. Here it just waits a
// bit and echoes back — enough to practice the hard parts: async, timeouts,
// and error handling.
//
// Interview talking point (Alan): the genuinely hard problems in an agent
// runtime are NOT "call the tool" — they're timeouts, retries, idempotency,
// and observability. This mock lets you talk about those concretely.
// ---------------------------------------------------------------------------

export interface ToolResult {
  output: string;
  durationMs: number;
}

// Sleep helper — wraps setTimeout in a Promise so you can `await` it.
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulates calling an external tool.
 * - Randomly takes 50–250ms.
 * - ~10% of the time it "fails" by throwing, so you can practice error paths.
 */
export async function runMockTool(prompt: string): Promise<ToolResult> {
  const start = Date.now();
  const delay = 50 + Math.floor(Math.random() * 200);
  await sleep(delay);

  if (Math.random() < 0.1) {
    throw new Error("tool call failed (simulated)");
  }

  return {
    output: `Processed: "${prompt}" (${prompt.length} chars)`,
    durationMs: Date.now() - start,
  };
}

// ---------------------------------------------------------------------------
// DAY 4 / DAY 5 EXERCISE — wrap this with a timeout.
// Write `runMockToolWithTimeout(prompt, timeoutMs)` that rejects if the tool
// takes longer than timeoutMs. Hint: Promise.race([runMockTool(...), timeout]).
// This is the kind of code you'd want in a real harness.
// ---------------------------------------------------------------------------
