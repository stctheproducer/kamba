# V0 Generated Code Guidelines

- The v0 generated code is in the `v0-generated-code` directory
- Ensure that the colors and themes in the project's `inertia` directory follow the theme of the generated code AND are up to spec with Tailwind CSS v4 recommendations
- Some components may be obtained from the `@assistant-ui/react`, `@assistant-ui/react-markdown`, and `@assistant-ui/react-ai-sdk` packages, especially for the elements and components on the chat screen
- Use InertiaJS for the frontend code. Do not use NextJS primitives
- Use AdonisJS v6 for the backend. Adapt any NextJS backend code to AdonisJS v6
- Use Tailwind CSS v4 for the frontend code
- Use React v19 for the frontend code
- The v0 generated code is for UI enhancement only
- You should adapt the generated code to the current project, with UI components limited to the `inertia` directory
- Configuration values that depend on environment values shall first depend on InertiaJS' shared data before any `VITE_ENV_{ABRITRARY_VALUE}` environment variables
