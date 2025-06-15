# Architecture Guidelines

## Overall Architecture

- Follow the service-oriented monolith approach with a local-first user experience.
- Maintain clear separation of concerns to enable potential future microservice refactoring.
- Respect the WebSocket-based synchronization between client LiveStore and server SQLite.

## Technology Stack

- **Backend**: AdonisJS v6
- **Frontend**: InertiaJS v2, React 19, Shadcn UI, Assistant-UI
- **Database (Server)**: SQLite (for main data, cache, limiter)
- **Database (Client)**: LiveStore (browser-based SQLite)
- **Vector Database**: Weaviate (for RAG functionality)
- **Authentication**: Logto
- **Storage**: Cloudflare R2
- **Realtime**: Custom WebSocket sync provider via `adonisjs-websocket`
- **Background Jobs**: Trigger.dev
- **Analytics & Monitoring**: Posthog, OpenMeter
- **Payment Processing**: Lipila & Lenco (local), Paddle & Stripe (international via `@foadonis/shopkeeper`)
- **AI SDKs**: `ai` (from Vercel), `@ai-sdk`
- **Package Manager**: pnpm

## File Structure

- Respect the established project structure with clear separation between app components, configuration, and resources.
- Place new backend code in the appropriate directories under `/app` (controllers, models, events, etc.).
- Frontend code should be organized within the `/inertia` directory.
