import { buildApp } from "./app";

// ---------------------------------------------------------------------------
// The entry point. Reads config from the environment (12-factor: config lives
// in the environment, not in code) and starts listening.
// ---------------------------------------------------------------------------
const PORT = Number(process.env.PORT ?? 3000);

const app = buildApp();

app.listen(PORT, () => {
  console.log(`agent-task-runner listening on http://localhost:${PORT}`);
});
