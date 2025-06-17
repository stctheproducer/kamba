# Code Style Guidelines

## General Style

- Use 2 spaces for indentation
- Do not use semicolons
- Use single quotes for strings
- Use explicit types where beneficial for readability
- Prefer `async/await` over promise chains
- Use `const` by default, `let` only when reassignment is necessary
- Use `null` instead of `undefined` when appropriate
- Use the `tryCatch` helper function instead of try-catch blocks
- Use descriptive variable and function names
- Do not use Next.js specific features
- Do not use `"use client"` or `"use server"`

## TypeScript

- Ensure proper type definitions for all code
- Run `pnpm typecheck` to verify type correctness

## Linting and Formatting

- All code must pass linting (`pnpm lint`) and formatting (`pnpm format`) checks
- ESLint and Prettier configurations should not be modified without team discussion
