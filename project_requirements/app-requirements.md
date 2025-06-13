# T3 Chat Clone App Requirements

I want to create an AI chat application with an interface that looks like Claude, but with a Gumroad theme feel. I need the app to meet certain requirements.

- I am building it in AdonisJS v6 with InertiaJS v2 and React 19
- I will make extensive use of @adonisjs/redis, @adonisjs/cache, @adonijs/events, adonis-auditing package, adonisjs-activitylog package, @adonisjs/logger, @adonijs/encryption, @adonisjs/lock, @adonisjs/drive, ai (from vercel), @ai-sdk, assistant-ui, shadcn, @adonisjs/ally, @adonisj/lucid, @foadonis/shopkeeper
- I will use weaviate for RAG
- I will use Posthog for analytics, error tracking, and feature flags
- I will use the feature flags to establish a beta model
- I will use Logto for authentication
- I will use a PostgreSQL database
- I will use Trigger.dev for queues
- I will use Redis for caching
- I will use Cloudflare R2 for file storage
- I will use OpenMeter for tracking usage
- I will have an adapter for payments (local with Lipila, international with Paddle, and Stripe)
- I will use PGLite together with the `ai` package for local first storage

## Core Requirements

- Able to input multiple language models and providers with BYOK functionality
- It should be browser friendly
- User authentication with chat history synchronization
- Easy to try
- It must be behind a paywall
- Bring your own key with priority support for OpenRouter API keys

## Bonus features

- Allow users to upload files (images and pdfs)
- Syntax highlighting for beautify code formatting and highlighting
- Chat branching to create alternative conversation paths
- Real-time web search
- AI-powerd image generation capabilities
- Resumable streams to continue generation after page refresh
- Chat sharing to share conversations with others
- Local first storage

I need the system to built with a service oriented structure in mind so that I can easily branch into microservices. I need suggestions for how I can handle realtime.
