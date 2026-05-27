# agent-task-runner

一个迷你版 "AI agent 任务运行器" REST API。这是你这一周的练手主项目,**同时覆盖 TypeScript / Node / Express / TDD / 微服务概念 / Docker**——也就是你简历里缺的那一整块。主题特意选成 agent harness 的缩小版,面试时可以直接讲。

---

## 快速开始

```bash
npm install        # 装依赖(已帮你装好,clone 后需重跑)
npm test           # 跑全部测试(应全绿)
npm run dev        # 本地起服务,改代码自动重启
npm run typecheck  # 只做类型检查,不输出文件
npm run build      # 编译到 dist/
```

服务起来后试一下:

```bash
curl -X POST localhost:3000/tasks -H 'Content-Type: application/json' -d '{"prompt":"summarize this"}'
curl localhost:3000/tasks
curl localhost:3000/health
```

---

## 代码地图(按"该先读哪个"排序)

| 文件 | 学什么 |
|---|---|
| `src/models/task.ts` | TS 类型系统:`interface` vs `type`、union、`readonly`、`Pick` |
| `src/schemas/task.schema.ts` | zod 运行时校验 + 从 schema 推断类型 |
| `src/repositories/task.repository.ts` | 接口 + 实现、依赖倒置、为什么方法都是 async |
| `src/services/task.service.ts` | 业务逻辑、构造函数注入、自定义错误类型 |
| `src/routes/tasks.routes.ts` | 薄 HTTP 层、async 错误转发 |
| `src/middleware/error-handler.ts` | 集中式错误处理 → HTTP 状态码 |
| `src/app.ts` | 依赖装配(composition root)、健康检查 |
| `src/index.ts` | 启动服务、从环境读配置(12-factor) |
| `tests/*.test.ts` | 单元测试(service)+ 集成测试(supertest 打 HTTP) |

---

## 已经写好 vs 你要自己做

**已写好并测试通过的(读懂它,能逐行讲):**
- 创建任务 `POST /tasks`、列出 `GET /tasks`、查单个 `GET /tasks/:id`(含 404)
- zod 校验、集中错误处理、内存仓库、健康检查
- 一组单元测试 + 集成测试做范例

**留给你的练习(代码里都有 `EXERCISE` 注释指路):**
- **Day 4 — 实现 `runTask`**(`src/services/task.service.ts`)。**先写测试再写实现**(red-green-refactor)。
- **Day 4 — SQLite 仓库**(`src/repositories/task.repository.ts`)。实现同一个接口,然后在 `src/app.ts` 改一行换上去——*service 和 routes 完全不动*,这个"零改动替换"讲给 architect(Alan)听很加分。
- **Day 5 — 给工具调用加超时**(`src/tools/mock-tool.ts`),用 `Promise.race`。

---

## 怎么对应到三个面试官

- **Daniel(写代码的同事)**:这个项目本体——干净分层、带测试、TDD 流程。能现场加一个 endpoint、补一个测试。
- **Alan(architect)**:依赖倒置、接口换实现、超时/重试/幂等、agent 运行时的可观测性难点。
- **Benjamin(team head)**:你能用一句话讲清"这是 agent harness 的玩具版,我用它来补 Node 后端,同时用 TDD 保证质量"——顺带证明你学得快、会用 AI 工具加速。

---

## 建议:用 AI 工具做,但要管住它

JD 要 "AI-supported / vibe-coding"。用 Cursor / Copilot / Claude Code 来加速学习是对的——但**每写一段就配一个测试**,别盲信生成的代码。这个习惯本身就是面试的好素材。
