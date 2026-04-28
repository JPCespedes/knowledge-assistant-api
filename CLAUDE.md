# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run start:dev

# Build
npm run build

# Run all unit tests
npm run test

# Run a single test file
npx jest src/app.controller.spec.ts

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:cov

# Lint (auto-fixes)
npm run lint

# Format
npm run format
```

## Architecture

This is a **NestJS 11** REST API using TypeScript, currently at the scaffolding stage.

**Request flow:** `main.ts` bootstraps the app on port 3000 (or `$PORT`) → `AppModule` wires controllers and providers → `AppController` handles HTTP routes → `AppService` contains business logic.

**Module structure:** Features should be organized as NestJS modules. Each feature gets its own directory under `src/` containing a module, controller, and service. Register new feature modules in `AppModule.imports`.

**Testing conventions:**
- Unit tests live alongside source files as `*.spec.ts` in `src/`
- E2e tests live in `test/` as `*.e2e-spec.ts`
- Use `@nestjs/testing`'s `Test.createTestingModule` for unit tests; `supertest` for e2e

**TypeScript config:** `noImplicitAny` is off; `strictNullChecks` is on. Targets ES2023, outputs to `dist/`.
