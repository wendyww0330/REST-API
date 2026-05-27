# agent-task-runner

一个迷你版 "AI agent 任务运行器" REST API。**同时覆盖 TypeScript / Node / Express / TDD / 微服务概念 / Docker**。

---

## 快速开始

```bash
npm install        # 装依赖
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



**已写好并测试通过的:**
- 创建任务 `POST /tasks`、列出 `GET /tasks`、查单个 `GET /tasks/:id`(含 404)
- zod 校验、集中错误处理、内存仓库、健康检查
- 一组单元测试 + 集成测试做范例

**留给你的练习:**
- **实现 `runTask`**(`src/services/task.service.ts`)。**先写测试再写实现**(red-green-refactor)。
- **SQLite 仓库**(`src/repositories/task.repository.ts`)。实现同一个接口,然后在 `src/app.ts` 改一行换上去——*service 和 routes 完全不动*,这个"零改动替换"讲给 architect(Alan)听很加分。
- ** 给工具调用加超时**(`src/tools/mock-tool.ts`),用 `Promise.race`。

