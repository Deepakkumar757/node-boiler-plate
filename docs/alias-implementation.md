# Backend Project Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Path Aliases in TypeScript](#path-aliases-in-typescript)
- [How to Add a New Path Alias](#how-to-add-a-new-path-alias)
- [Example: Adding a New Alias](#example-adding-a-new-alias)
- [Troubleshooting](#troubleshooting)
- [Scripts](#scripts)
- [Environment](#environment)

---

## Project Overview
This backend project is built with Node.js, TypeScript, and TypeORM. It follows a modular architecture and uses path aliases for clean and maintainable imports. All environment variables and database credentials are managed securely via `.env` files.

---

## Path Aliases in TypeScript

This project uses TypeScript path aliases for cleaner and more maintainable imports. **Aliases must be defined in both `tsconfig.json` and `package.json` for them to work in development and production.**

### How to Add a New Path Alias

#### 1. Add the Alias in `tsconfig.json`

Edit the `paths` section inside `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@lib/*": ["lib/*"],
      "@src/*": ["*"],
      "@domain/*": ["domain/*"],
      "@datasource/*": ["lib/datasource/*"]
    }
  }
}
```

**Example:** To add an alias for `@utils/*`:

```json
"paths": {
  "@utils/*": ["utils/*"]
}
```

#### 2. Add the Alias in `package.json`

Edit the `_moduleAliases` section:

```json
{
  "_moduleAliases": {
    "@lib": "dist/lib",
    "@src": "dist",
    "@domain": "dist/domain",
    "@datasource": "dist/lib/datasource"
  }
}
```

**Example:** For `@utils`:

```json
"_moduleAliases": {
  "@utils": "dist/utils"
}
```

#### 3. Use the Alias in Your Code

```typescript
import { getClientIp } from '@utils/getClientIp';
```

### Notes
- Always keep the aliases in `tsconfig.json` and `package.json` in sync.
- Run `npm run build` after changing aliases.
- In development, `ts-node` uses `tsconfig.json` paths; in production, Node.js uses `_moduleAliases` with `module-alias`.

---

## Example: Adding a New Alias

Suppose you want to add `@services/*` for all files in `src/services/`:

**In `tsconfig.json`:**
```json
"paths": {
  "@services/*": ["services/*"]
}
```

**In `package.json`:**
```json
"_moduleAliases": {
  "@services": "dist/services"
}
```

**Usage:**
```typescript
import { myService } from '@services/myService';
```

---

## Troubleshooting
- If you get `Cannot find module` errors, check that both configs are updated and you have rebuilt the project.
- If you add a new alias, always run `npm run build` before starting in production.

---

## Scripts
- `npm run build`: Compiles TypeScript to `dist/`.
- `npm start`: Runs compiled code with alias support.
- `npm run dev`: Runs development server (if available).

---

## Environment
- Node.js
- TypeScript
- TypeORM
- module-alias

---

For more details, see the official docs:
- [TypeScript Path Mapping](https://www.typescriptlang.org/tsconfig#paths)
- [module-alias](https://www.npmjs.com/package/module-alias)
