# Kamba

> This project is my implementation of the [T3 Chat Cloneathon](https://cloneathon.t3.chat/)

A premium AI chat application, offering multiple language model support, BYOK functionality, and advanced features like RAG, file uploads, and chat management.

## Overview

This application provides a feature-rich AI chat experience with the flexibility to choose models and use your own API keys. The service is designed with a premium model, offering easy trial access while maintaining a paywall for full features. The architecture follows a service-oriented approach to enable future scaling and feature development.

## Features

### Core Features

- Multiple language models and providers with BYOK functionality
- Browser-friendly interface with Claude-like UX and Gumroad theming
- User authentication with chat history synchronization
- Easy to try with premium features behind a paywall
- Bring your own key with priority support for OpenRouter API keys
- Custom prompts for everyday tasks

### Bonus Features

- File uploads (images and PDFs)
- Syntax highlighting for code formatting
- Chat branching for alternative conversation paths
- Real-time web search
- AI-powered image generation
- Resumable streams (continue generation after page refresh)
- Chat sharing
- Local-first storage

## Project Status

### Implementation Progress

#### Phase 1: Core Authentication & User Management

- ✅ Authentication with Logto
- 🔄 User creation after login process
- 🔄 Custom prompts for user presets

#### Phase 2: Basic Chat Functionality

- ⏳ Database schema for chats and messages
- ⏳ Basic chat UI implementation (Claude-like with Gumroad theme)
- ⏳ Integration with AI models via Vercel AI SDK
- ⏳ BYOK functionality with OpenRouter priority support

#### Phase 3: Core Features

- ⏳ Chat history synchronization
- ⏳ Multiple language model support
- ⏳ Paywall implementation
- ⏳ Local-first storage with PGLite

#### Phase 4: Enhanced Features

- ⏳ File uploads (images and PDFs)
- ⏳ RAG implementation with Weaviate
- ⏳ Syntax highlighting for code
- ⏳ Usage tracking with OpenMeter

#### Phase 5: Advanced Features

- ⏳ Chat branching
- ⏳ Real-time web search
- ⏳ AI-powered image generation
- ⏳ Resumable streams
- ⏳ Chat sharing

## Technology Stack

- **Backend**: AdonisJS v6
- **Frontend**: InertiaJS v2, React 19, Shadcn UI, Assistant-UI
- **Database**: PostgreSQL, Weaviate (vector DB), PGLite (local-first)
- **Authentication**: Logto
- **Storage**: Cloudflare R2
- **Caching**: Redis
- **Background Jobs**: Trigger.dev
- **Analytics & Monitoring**: Posthog, OpenMeter
- **Payment Processing**: Lipila & Lenco (local), Paddle & Stripe (international)

## Installation & Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis
- Weaviate (for RAG features)
- Cloudflare R2 account (for file storage)

### Environment Setup

1. Clone the repository

```bash
git clone https://github.com/stctheproducer/kamba.git
cd kamba
```

2. Install dependencies

```bash
pnpm install
```

3. Configure environment variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration details.

4. Run database migrations

```bash
node ace migration:run
```

5. Start the development server

```bash
pnpm dev
```

## Architecture

The application follows a service-oriented architecture to enable future scaling and feature development. Key components include:

- **Frontend Container**: React, InertiaJS, Shadcn, Assistant-UI
- **Backend API Container**: AdonisJS v6
- **Database Containers**: PostgreSQL, Weaviate, Redis
- **PGLite Instance**: Local-first database storage in the browser

The system integrates with multiple external services including Logto for authentication, AI model providers, OpenRouter API, Cloudflare R2 for storage, Posthog for analytics, Trigger.dev for background jobs, OpenMeter for usage tracking, and various payment gateways.

## Realtime Implementation

The application implements realtime features using WebSockets through AdonisJS:

- **WebSocket Server**: Handles connections from authenticated users
- **Event Emission**: Uses `@adonijs/events` throughout backend services
- **WebSocket Broadcasting**: Sends updates to relevant user connections
- **Resumable Streams**: Tracks AI generation state for resuming after disconnection

## Author

- **Name**: Chanda Mulenga
- **Email**: <chanda@kamba.app>
- **GitHub**: [stctheproducer](https://github.com/stctheproducer)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Security

For information about security policies and reporting vulnerabilities, please see the [SECURITY.md](SECURITY.md) file.
