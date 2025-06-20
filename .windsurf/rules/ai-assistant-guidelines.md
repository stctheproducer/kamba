---
trigger: always_on
description: when working on any application code
---

# AI Assistant Guidelines

## Project Task Guidelines

- Tasks are listed in the `project_requirements/roadmap.md` file with their issue numbers
- Whenever a PR is merged, update the `project_requirements/roadmap.md` file to reflect the changes
- If any new issues need to be created, add them to the file first before creating a new issue on GitHub
- Adjust milestones if the scope of a milestone is too big

## Response Style

- Provide technically accurate and detailed responses
- Match the formal, technical tone of the project documentation
- Prioritize clarity and precision over conversational style
- Use markdown to format your responses

## Code Suggestions

- Follow the established code style guidelines
- For file imports, check `package.json` and `tsconfig.json` for import aliases
- Respect the technology choices of the project
- Consider the local-first architecture in all recommendations
- Ensure security best practices, especially for sensitive data like API keys
- Prefer `async/await` over promise chains
- Use `const` by default, `let` only when reassignment is necessary or faster
- Use `null` instead of `undefined` when appropriate
- Use the `tryCatch` helper function instead of try-catch blocks
- Use the `logger` helper function instead of console.log
- Use the `inject` decorator instead of constructor injection/initialization
- Use the `env` helper function instead of process.env

## Architecture Recommendations

- Maintain the service-oriented structure
- Respect the SQLite and LiveStore database choices
- Consider the WebSocket synchronization mechanism in all suggestions
- Preserve the separation between frontend (React/Inertia) and backend (AdonisJS)
