# Fund Reminder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a first-version local fund reminder that reads an 8-fund pool, applies decline tiers, and sends one aggregated Feishu message.

**Architecture:** Keep investment rules as pure TypeScript functions. Keep fund data fetching and Feishu delivery behind small adapters. The CLI coordinates config loading, data fetch, evaluation, formatting, and optional sending.

**Tech Stack:** Node.js 22, TypeScript, Vitest, built-in `fetch`, `child_process` for `cc-connect send`.

---

## File Structure

- `package.json`: npm scripts and dependencies.
- `tsconfig.json`: TypeScript config.
- `vitest.config.ts`: test config.
- `README.md`: usage and constraints.
- `config/funds.json`: 8 active Alipay fixed-investment funds.
- `config/rules.json`: decline tiers and reminder options.
- `src/core/types.ts`: shared types.
- `src/core/evaluate.ts`: pure decline-tier evaluation.
- `src/core/message.ts`: pure aggregated Feishu message formatter.
- `src/adapters/config.ts`: JSON config loader.
- `src/adapters/eastmoney.ts`: fund data adapter.
- `src/adapters/feishu.ts`: `cc-connect send` adapter.
- `src/cli.ts`: command entrypoint.
- `test/evaluate.test.ts`: rule tests.
- `test/message.test.ts`: message formatting tests.

## Task 1: Project Skeleton

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `README.md`
- Create: `.gitignore`

- [ ] **Step 1: Add package metadata and scripts**

Create `package.json` with `check`, `test`, `build`, and `start` scripts.

- [ ] **Step 2: Add TypeScript and Vitest config**

Create `tsconfig.json` and `vitest.config.ts`.

- [ ] **Step 3: Add README constraints**

Document that the tool only reminds and never buys automatically.

- [ ] **Step 4: Install dependencies**

Run: `npm install`

- [ ] **Step 5: Verify skeleton**

Run: `npm run check`

Expected: TypeScript exits with code 0 after source files exist in later tasks.

## Task 2: Rule Engine

**Files:**
- Create: `src/core/types.ts`
- Create: `src/core/evaluate.ts`
- Create: `test/evaluate.test.ts`

- [ ] **Step 1: Write failing tests**

Test exact tier matching for `-1.9`, `-2`, `-4`, and `-6`.

- [ ] **Step 2: Run tests and watch failure**

Run: `npm test -- test/evaluate.test.ts`

Expected: fail because `evaluateFund` is missing.

- [ ] **Step 3: Implement minimal evaluator**

Choose the deepest matched tier and calculate `suggestedAmount = baseAmount * multiplier`.

- [ ] **Step 4: Run tests**

Run: `npm test -- test/evaluate.test.ts`

Expected: pass.

## Task 3: Aggregated Message

**Files:**
- Create: `src/core/message.ts`
- Create: `test/message.test.ts`

- [ ] **Step 1: Write failing formatter tests**

Test triggered, near-trigger, error, and total suggested amount sections.

- [ ] **Step 2: Run tests and watch failure**

Run: `npm test -- test/message.test.ts`

Expected: fail because `formatReminderMessage` is missing.

- [ ] **Step 3: Implement formatter**

Return one text message for Feishu.

- [ ] **Step 4: Run tests**

Run: `npm test -- test/message.test.ts`

Expected: pass.

## Task 4: Config And CLI

**Files:**
- Create: `config/funds.json`
- Create: `config/rules.json`
- Create: `src/adapters/config.ts`
- Create: `src/adapters/eastmoney.ts`
- Create: `src/adapters/feishu.ts`
- Create: `src/cli.ts`

- [ ] **Step 1: Add config files**

Use the 8 active funds from the spec. Do not add paused funds.

- [ ] **Step 2: Implement config loader**

Read JSON from project-relative paths.

- [ ] **Step 3: Implement fund data adapter**

Fetch latest fund data by code. If unavailable, return a per-fund data error.

- [ ] **Step 4: Implement Feishu sender**

Use the existing `cc-connect.exe send` command with configurable project/session.

- [ ] **Step 5: Implement CLI**

Support `--dry-run` to print the message without sending.

- [ ] **Step 6: Verify CLI**

Run: `npm run start -- --dry-run`

Expected: one aggregated message printed.

## Task 5: Final Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Run tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run typecheck**

Run: `npm run check`

Expected: no TypeScript errors.

- [ ] **Step 3: Run dry-run**

Run: `npm run start -- --dry-run`

Expected: reads 8 funds and prints one aggregated message.

- [ ] **Step 4: Commit**

Run:

```bash
git add .
git commit -m "初始化基金提醒器"
```
