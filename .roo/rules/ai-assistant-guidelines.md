# AI Assistant Guidelines

## Response Style

- Provide technically accurate and detailed responses
- Match the formal, technical tone of the project documentation
- Prioritize clarity and precision over conversational style

## Code Suggestions

- Follow the established code style guidelines
- Respect the technology choices of the project
- Consider the local-first architecture in all recommendations
- Ensure security best practices, especially for sensitive data like API keys
- Prefer `async/await` over promise chains
- Use `const` by default, `let` only when reassignment is necessary or faster
- Use `null` instead of `undefined` when appropriate
- Use the `tryCatch` helper function instead of try-catch blocks

## Architecture Recommendations

- Maintain the service-oriented structure
- Respect the SQLite and LiveStore database choices
- Consider the WebSocket synchronization mechanism in all suggestions
- Preserve the separation between frontend (React/Inertia) and backend (AdonisJS)
