# Design Document

Version: 2.0
Date: 2025-06-14

## BUSINESS POSTURE

The primary business goal of this application is to provide a premium, feature-rich AI chat experience that allows users flexibility in choosing models and the option to use their own API keys. The paywall ensures a revenue model, while the "easy to try" aspect aims to lower the barrier to entry for potential paying users. Supporting BYOK, especially for OpenRouter, caters to users who may have existing API access or prefer centralized billing outside the application for usage costs, while the application provides a superior interface and additional features like RAG, file uploads, and chat management. The service-oriented architecture goal is to enable future scaling and feature development by potentially breaking down components into microservices. The adoption of SQLite and LiveStore suggests a focus on developer experience, potentially simpler deployment for smaller scale, and enabling the local-first user experience.

### Most important business risks

* **Monetization Risk:** The success depends heavily on the paywall and premium features being compelling enough for users to pay, especially when many free or lower-cost alternatives exist.
* **User Adoption Risk:** Attracting users in a crowded market, despite the unique features like BYOK and the specific UI/UX theme.
* **API Key Security Risk:** Storing and managing user-provided API keys requires robust security measures to prevent breaches, which could severely damage trust and reputation.
* **Scalability Risk (SQLite):** While SQLite can handle concurrent reads, its write performance can become a bottleneck under high concurrent write loads, potentially impacting the backend API's responsiveness as the user base grows. The WAL and other pragmas help, but it's a different scaling profile than a client-server database like PostgreSQL.
* **Scalability Risk (LiveStore Sync):** The custom WebSocket sync provider needs to efficiently handle potentially a large number of concurrent WebSocket connections and synchronize data reliably for many users.
* **Feature Development Risk:** Successfully integrating numerous third-party libraries and services (payment gateways, RAG, authentication, multiple AI APIs, LiveStore sync) requires significant development effort and introduces potential integration challenges.
* **Data Management Complexity (SQLite/LiveStore):** Managing multiple SQLite database files and ensuring data consistency between the server (main SQLite) and client (LiveStore/SQLite) adds complexity compared to a single client-server database.

## SECURITY POSTURE

### Existing security controls

* security control: User authentication provided by Logto.
* security control: Activity logging via adonisjs-activitylog.
* security control: Auditing via adonis-auditing package.
* security control: Encryption utilities provided by @adonijs/encryption (likely used for sensitive data like API keys).
* security control: Locking mechanism provided by @adonisjs/lock (if used, potentially relying on SQLite).
* security control: Logging infrastructure via @adonisjs/logger.
* security control: Rate limiting via @adonisjs/limiter (using a dedicated SQLite connection).

### Accepted risks

* No specific accepted risks were mentioned in the input. It is assumed that all identified risks should be mitigated or addressed.

### Recommended security controls

* security control: Input validation on all user-provided data (chat messages, file uploads, configuration settings, API keys) to prevent injection attacks (relevant for backend processing of data from LiveStore sync).
* security control: Rate limiting on API endpoints and WebSocket connections (@adonisjs/limiter is implemented).
* security control: Secure storage and strict access control for user-provided API keys, potentially using robust encryption with limited access within the application. Ensure the encryption keys are managed securely, separate from the SQLite database files.
* security control: Implement granular authorization checks to ensure users can only access their own chats, files, and settings, both via HTTP API and WebSocket sync.
* security control: Regular security audits and penetration testing of the application and infrastructure.
* security control: Enforce secure coding practices throughout the development lifecycle, paying attention to potential vulnerabilities when interacting with SQLite files and handling data synchronization.
* security control: Implement Content Security Policy (CSP) headers to mitigate XSS attacks in the frontend.
* security control: Secure configuration management for all services and databases, including the paths and access permissions for the SQLite database files.
* security control: Secure the WebSocket connection for LiveStore sync with authentication and encryption (WSS).

### Security requirements

* Security requirement: All user data, including chat history and uploaded files, must be stored securely and be accessible only by the authenticated user. This applies to data in the main SQLite database, LiveStore (locally), and Cloudflare R2.
* Security requirement: User-provided API keys must be encrypted at rest in the main SQLite database and in transit. Access to these keys must be strictly controlled.
* Security requirement: The application must authenticate all users before allowing access to paid features, personalized data, and establishing WebSocket connections for sync.
* Security requirement: Communication between the frontend and backend (HTTP and WebSocket), and between the backend and external services must be encrypted (e.g., using TLS/SSL/WSS).
* Security requirement: The application must be resilient to common web vulnerabilities and ensure the integrity of data synchronized between LiveStore and the server.
* Security requirement: Compliance with relevant data privacy regulations (e.g., GDPR, CCPA) depending on user location and data handled.
* Security requirement: The SQLite database files on the server must have appropriate file system permissions to prevent unauthorized access.

## DESIGN

### C4 CONTEXT

The system context diagram shows the AI Chat Application system in the middle, surrounded by the users who interact with it and the external systems it depends on. The core persistence is now handled by SQLite files, and real-time data synchronization uses WebSockets with LiveStore.

```mermaid
C4Context
title System Context Diagram for AI Chat Application

Person(authenticated_user, "Authenticated User", "A user who has logged into the application and has a paid subscription or access.")
Person(unauthenticated_user, "Unauthenticated User", "A potential user who has not yet logged in or paid.")

System(ai_chat_system, "AI Chat Application", "Provides an AI chat interface with support for multiple models, BYOK, RAG, file uploads, and local-first sync.")

System(logto_auth, "Logto", "Handles user authentication.")
System(ai_model_providers, "AI Model Providers", "External services providing various AI models (e.g., OpenAI, Anthropic, Google AI).")
System(openrouter_api, "OpenRouter API", "Aggregates multiple AI models, specifically for BYOK users.")
System(sqlite_databases, "SQLite Databases", "Stores user data, chat history, configurations, cache, and limiter state in multiple files.") # Represents tmp/main.sqlite, tmp/cache.sqlite, tmp/limiter.sqlite
System(weaviate_db, "Weaviate", "Vector database used for RAG.")
System(cloudflare_r2, "Cloudflare R2", "Object storage for uploaded files.")
System(posthog_analytics, "Posthog", "Provides analytics, error tracking, and feature flags.")
System(trigger_dev, "Trigger.dev", "Handles background jobs and queues.")
System(openmeter_usage, "OpenMeter", "Tracks application usage for billing and limits.")
System(payment_gateways, "Payment Gateways", "Processes payments (Lipila, Paddle, and Stripe).")
System(external_web_search, "External Web Search", "Provides real-time information for the web search bonus feature.") # This might be integrated via an AI provider or a separate service
System(livestore_browser, "LiveStore (Browser)", "Browser-based SQLite instance for local-first chat history.")

Rel(authenticated_user, ai_chat_system, "Uses (via Browser Interface)")
Rel(unauthenticated_user, ai_chat_system, "Can access (limited, via Browser Interface)")

Rel(ai_chat_system, logto_auth, "Authenticates users against")
Rel(ai_chat_system, ai_model_providers, "Interacts with (for non-BYOK models)")
Rel(ai_chat_system, openrouter_api, "Interacts with (for BYOK and OpenRouter models)")
Rel(ai_chat_system, sqlite_databases, "Reads from and Writes to")
Rel(ai_chat_system, weaviate_db, "Queries and Indexes data in")
Rel(ai_chat_system, cloudflare_r2, "Stores and Retrieves files from")
Rel(ai_chat_system, posthog_analytics, "Sends events and Checks feature flags")
Rel(ai_chat_system, trigger_dev, "Enqueues background jobs")
Rel(ai_chat_system, openmeter_usage, "Reports usage data to")
Rel(ai_chat_system, payment_gateways, "Processes payments via")
Rel(ai_chat_system, external_web_search, "Queries")
Rel(authenticated_user, livestore_browser, "Interacts with locally") # User interacts with the UI, which uses LiveStore
Rel(ai_chat_system, livestore_browser, "Synchronizes data with", "WebSockets") # Backend sync provider communicates with client LiveStore
```

| Name                  | Type            | Description                                                                 | Responsibilities                                                                 | Security controls                                                                 |
| :-------------------- | :-------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| Authenticated User    | Person          | A user who is logged in and has access to paid features.                    | Interact with the AI, manage settings, view history, manage BYOK keys, interact with local-first data. | N/A (User is external)                                                            |
| Unauthenticated User  | Person          | A potential user who has not yet logged in or paid.                         | View landing page, potentially limited chat access (easy to try), sign up/login. | N/A (User is external)                                                            |
| AI Chat Application   | Software System | The main application providing the chat interface and backend logic.        | Manage user sessions, handle chat interactions, orchestrate AI calls, manage data in SQLite, provide LiveStore sync. | Logto for authentication, adonis-auditing, adonisjs-activitylog, @adonijs/encryption, @adonisjs/lock, @adonisjs/logger, @adonisjs/limiter, Input Validation, Authorization Checks, Secure Configuration, Secure WebSocket Sync. |
| Logto               | Software System | Third-party authentication service.                                         | User registration, login, identity management, providing user tokens.          | N/A (External System - Security managed by Logto)                                 |
| AI Model Providers    | Software System | External services hosting various language models.                          | Process prompts, generate responses.                                             | N/A (External System - Security managed by providers)                             |
| OpenRouter API        | Software System | Aggregates access to multiple AI models, including BYOK support.            | Route AI requests, manage API keys (for their own service), process prompts.     | N/A (External System - Security managed by OpenRouter)                            |
| SQLite Databases      | Database        | File-based databases storing structured application data, cache, and limiter state. | Store user data, chat history backup, configurations, payments, logs (main); cache data (cache); rate limit state (limiter). | File system access control, Encryption at rest (if implemented at file level). |
| Weaviate              | Database        | Vector database for storing and querying embeddings for RAG.              | Store document embeddings, perform similarity searches for RAG context.          | Access control, Network isolation.                                                |
| Cloudflare R2         | Storage         | Object storage service for storing uploaded files.                          | Store and serve user-uploaded files securely.                                    | Access control policies, Encryption in transit and at rest.                       |
| Posthog               | Software System | Analytics, error tracking, and feature flagging platform.                   | Collect user behavior data, track errors, manage feature flag rollout.           | N/A (External System - Security managed by Posthog)                               |
| Trigger.dev           | Software System | Background job processing and queue management.                             | Execute tasks like file processing, image generation, notifications asynchronously. | N/A (External System - Security managed by Trigger.dev)                           |
| OpenMeter             | Software System | Usage tracking and metering platform.                                       | Record and aggregate user usage data (e.g., tokens used, files uploaded).        | N/A (External System - Security managed by OpenMeter)                             |
| Payment Gateways      | Software System | External services for processing online payments.                           | Handle payment transactions (credit cards, mobile money, etc.).                  | N/A (External System - Security managed by gateways, PCI compliance)              |
| External Web Search | Software System | Provides real-time data for the web search feature.                         | Fetch and return search results based on queries.                                | N/A (External System - Security managed by provider)                              |
| LiveStore (Browser) | Database        | Browser-based SQLite instance managed by LiveStore.                         | Store user's chat history and related data locally for fast access and offline use. | Stored within the browser sandbox, relies on browser security. Data is synced with the backend. |

### DATABASE DESIGN (SQLite)

The logical database design remains similar, but data is now stored across potentially multiple SQLite files managed by AdonisJS Lucid connections, and chat history is primarily managed by LiveStore on the client with server backup.

```mermaid
erDiagram
    users {
        uuid id PK
        uuid logto_id UK "Link to Logto user"
        varchar email UK
        varchar username
        timestamp created_at
        timestamp updated_at
        boolean is_beta_user
        boolean is_paying_user
    }

    chats {
        uuid id PK
        uuid user_id FK
        varchar title
        timestamp created_at
        timestamp updated_at
    }

    messages {
        uuid id PK
        uuid chat_id FK
        uuid? parent_message_id FK "For branching"
        varchar role "system, user, assistant, tool"
        text content
        jsonb metadata "e.g., tool calls, source documents"
        timestamp created_at
        timestamp updated_at
    }

    files {
        uuid id PK
        uuid user_id FK
        uuid? message_id FK "Optional: link to message that included the file"
        varchar file_name
        varchar file_type
        integer file_size
        varchar storage_path "Path in Cloudflare R2"
        varchar status "e.g., uploaded, processing, processed, failed"
        jsonb processing_details "e.g., RAG indexing status"
        timestamp created_at
        timestamp updated_at
    }

    models {
        uuid id PK
        varchar provider_name
        varchar model_id UK "Unique identifier for the model"
        varchar name "Human-readable name"
        boolean is_available
        boolean is_byok_supported
        boolean is_paid_model
        jsonb capabilities "e.g., image_generation, web_search"
        timestamp created_at
        timestamp updated_at
    }

    user_models {
        uuid id PK
        uuid user_id FK
        uuid model_id FK "Reference to the models table"
        text api_key "Encrypted API key"
        boolean is_active
        jsonb settings "e.g., specific model parameters"
        timestamp created_at
        timestamp updated_at
    }

    payments {
        uuid id PK
        uuid user_id FK
        varchar gateway "Stripe, Paddle, Lipila"
        varchar transaction_id UK
        numeric amount
        varchar currency
        varchar status "e.g., pending, completed, failed"
        jsonb details "Gateway-specific details"
        timestamp created_at
        timestamp updated_at
    }

    subscriptions {
        uuid id PK
        uuid user_id FK
        varchar plan_name
        varchar status "e.g., active, cancelled, past_due"
        timestamp start_date
        timestamp end_date
        varchar gateway_subscription_id "Reference to the gateway"
        jsonb details
        timestamp created_at
        timestamp updated_at
    }

    activity_logs {
        uuid id PK
        uuid user_id FK
        varchar event_name
        jsonb details
        timestamp created_at
    }

    audit_logs {
        uuid id PK
        uuid user_id FK
        varchar action
        varchar model_name
        uuid model_id
        jsonb old_data
        jsonb new_data
        timestamp created_at
    }

    users ||--|{ chats : "creates"
    chats ||--|{ messages : "contains"
    messages }o--o{ messages : "branches from"
    users ||--|{ files : "uploads"
    files }o--|| messages : "part of"
    users ||--|{ user_models : "configures"
    models ||--|{ user_models : "is configured for"
    users ||--|{ payments : "makes"
    users ||--|{ subscriptions : "has"
    users ||--|{ activity_logs : "generates"
    users ||--|{ audit_logs : "generates"
```

The tables above represent the *logical* data model. In the implementation with SQLite, these tables will primarily reside in the `tmp/main.sqlite` file.

#### users Table (tmp/main.sqlite)

| Column        | Type      | Description                         | Constraints            |
| :------------ | :-------- | :---------------------------------- | :--------------------- |
| id            | UUID      | Primary key                         | PK                     |
| logto_id      | UUID      | Unique ID from Logto              | UK, Not Null           |
| email         | VARCHAR   | User's email address                | UK, Not Null           |
| username      | VARCHAR   | User's chosen username              | Optional               |
| created_at    | TIMESTAMP | Record creation timestamp           | Not Null               |
| updated_at    | TIMESTAMP | Record last update timestamp        | Not Null               |
| is_beta_user  | BOOLEAN   | Flag for beta program participants  | Not Null, Default False |
| is_paying_user| BOOLEAN   | Flag indicating active subscription | Not Null, Default False |

#### chats Table (tmp/main.sqlite)

| Column    | Type      | Description                 | Constraints   |
| :-------- | :-------- | :-------------------------- | :------------ |
| id        | UUID      | Primary key                 | PK            |
| user_id   | UUID      | Foreign key referencing users | FK, Not Null  |
| title     | VARCHAR   | Title of the chat session   | Optional      |
| created_at| TIMESTAMP | Record creation timestamp   | Not Null      |
| updated_at| TIMESTAMP | Record last update timestamp| Not Null      |

#### messages Table (tmp/main.sqlite)

| Column           | Type      | Description                                   | Constraints            |
| :--------------- | :-------- | :-------------------------------------------- | :--------------------- |
| id               | UUID      | Primary key                                   | PK                     |
| chat_id          | UUID      | Foreign key referencing chats                 | FK, Not Null           |
| parent_message_id| UUID      | Foreign key for branching (self-referencing)  | FK, Optional           |
| role             | VARCHAR   | Role of the message sender (system, user, etc)| Not Null               |
| content          | TEXT      | The actual message content                    | Not Null               |
| jsonb            | JSONB     | Metadata (e.g., tool calls, RAG sources)      | Optional               |
| created_at       | TIMESTAMP | Record creation timestamp                     | Not Null               |
| updated_at       | TIMESTAMP | Record last update timestamp                  | Not Null               |

Note: While `chats` and `messages` are listed here for the server-side backup, the primary source and user interaction will be with the LiveStore instance in the browser. The server will need logic to sync changes from LiveStore into these backup tables and vice-versa for initial load or multi-device sync.

#### files Table (tmp/main.sqlite)

| Column             | Type      | Description                             | Constraints         |
| :----------------- | :-------- | :-------------------------------------- | :------------------ |
| id                 | UUID      | Primary key                             | PK                  |
| user_id            | UUID      | Foreign key referencing users           | FK, Not Null        |
| message_id         | UUID      | Foreign key referencing messages        | FK, Optional        |
| file_name          | VARCHAR   | Original name of the uploaded file      | Not Null            |
| file_type          | VARCHAR   | MIME type of the file                   | Not Null            |
| file_size          | INTEGER   | Size of the file in bytes               | Not Null            |
| storage_path       | VARCHAR   | Path or key in Cloudflare R2            | Not Null            |
| status             | VARCHAR   | Current processing status (e.g., 'processed')| Not Null            |
| processing_details | JSONB     | Details about RAG indexing or processing| Optional            |
| created_at         | TIMESTAMP | Record creation timestamp               | Not Null            |
| updated_at         | TIMESTAMP | Record last update timestamp            | Not Null            |

#### models Table (tmp/main.sqlite)

| Column            | Type      | Description                                   | Constraints         |
| :---------------- | :-------- | :-------------------------------------------- | :------------------ |
| id                | UUID      | Primary key                                   | PK                  |
| provider_name     | VARCHAR   | Name of the AI model provider                 | Not Null            |
| model_id          | VARCHAR   | Unique identifier from the provider/OpenRouter| UK, Not Null        |
| name              | VARCHAR   | Human-readable name of the model              | Not Null            |
| is_available      | BOOLEAN   | Is the model currently available for use?     | Not Null            |
| is_byok_supported | BOOLEAN   | Does this model support Bring Your Own Key?   | Not Null            |
| is_paid_model     | BOOLEAN   | Does using this model require a paid plan?    | Not Null            |
| capabilities      | JSONB     | JSON object listing model capabilities        | Optional            |
| created_at        | TIMESTAMP | Record creation timestamp                     | Not Null            |
| updated_at        | TIMESTAMP | Record last update timestamp                  | Not Null            |

#### user_models Table (tmp/main.sqlite)

| Column      | Type      | Description                                   | Constraints           |
| :---------- | :-------- | :-------------------------------------------- | :-------------------- |
| id          | UUID      | Primary key                                   | PK                    |
| user_id     | UUID      | Foreign key referencing users                 | FK, Not Null          |
| model_id    | UUID      | Foreign key referencing models                | FK, Not Null          |
| api_key     | TEXT      | Encrypted API key for the specific model/user | Not Null (must be encrypted) |
| is_active   | BOOLEAN   | Is this BYOK configuration currently active?  | Not Null, Default True |
| settings    | JSONB     | User-specific settings for this model         | Optional              |
| created_at  | TIMESTAMP | Record creation timestamp                     | Not Null              |
| updated_at  | TIMESTAMP | Record last update timestamp                  | Not Null              |

Note: The `api_key` field must be encrypted using `@adonijs/encryption` before storing and decrypted only when needed for API calls. Access to the decryption key should be highly restricted.

#### payments Table (tmp/main.sqlite)

| Column             | Type      | Description                           | Constraints         |
| :----------------- | :-------- | :------------------------------------ | :------------------ |
| id                 | UUID      | Primary key                           | PK                  |
| user_id            | UUID      | Foreign key referencing users         | FK, Not Null        |
| gateway            | VARCHAR   | Payment gateway used (Stripe, Paddle, etc)| Not Null            |
| transaction_id     | VARCHAR   | Unique ID from the payment gateway    | UK, Not Null        |
| amount             | NUMERIC   | Amount paid                           | Not Null            |
| currency           | VARCHAR   | Currency code (e.g., 'ZMW', 'USD')    | Not Null            |
| status             | VARCHAR   | Status of the payment                 | Not Null            |
| details            | JSONB     | Gateway-specific transaction details  | Optional            |
| created_at         | TIMESTAMP | Record creation timestamp             | Not Null            |
| updated_at         | TIMESTAMP | Record last update timestamp          | Not Null            |

#### subscriptions Table (tmp/main.sqlite)

| Column              | Type      | Description                                   | Constraints    |
| :------------------ | :-------- | :-------------------------------------------- | :------------- |
| id                  | UUID      | Primary key                                   | PK             |
| user_id             | UUID      | Foreign key referencing users                 | FK, Not Null   |
| plan_name           | VARCHAR   | Name of the subscription plan                 | Not Null       |
| status              | VARCHAR   | Status of the subscription                    | Not Null       |
| start_date          | TIMESTAMP | When the subscription started                 | Not Null       |
| end_date            | TIMESTAMP | When the subscription ends                    | Not Null       |
| gateway_subscription_id| VARCHAR| Reference ID in the payment gateway         | UK, Not Null   |
| details             | JSONB     | Gateway-specific subscription details         | Optional       |
| created_at          | TIMESTAMP | Record creation timestamp                     | Not Null       |
| updated_at          | TIMESTAMP | Record last update timestamp                  | Not Null       |

#### activity_logs Table (tmp/main.sqlite)

| Column    | Type      | Description                         | Constraints  |
| :-------- | :-------- | :---------------------------------- | :----------- |
| id        | UUID      | Primary key                         | PK           |
| user_id   | UUID      | Foreign key referencing users       | FK, Optional |
| event_name| VARCHAR   | Name of the activity (e.g., 'user.login')| Not Null     |
| details   | JSONB     | Details of the activity             | Optional     |
| created_at| TIMESTAMP | Record creation timestamp           | Not Null     |

Note: `user_id` is optional to log system activities not tied to a specific user.

#### audit_logs Table (tmp/main.sqlite)

| Column    | Type      | Description                               | Constraints  |
| :-------- | :-------- | :---------------------------------------- | :----------- |
| id        | UUID      | Primary key                               | PK           |
| user_id   | UUID      | Foreign key referencing users             | FK, Optional |
| action    | VARCHAR   | Type of action (e.g., 'create', 'update', 'delete')| Not Null     |
| model_name| VARCHAR   | Name of the model affected (e.g., 'User')| Not Null     |
| model_id  | UUID      | ID of the affected record                 | Optional     |
| old_data  | JSONB     | Previous state of the record            | Optional     |
| new_data  | JSONB     | New state of the record                 | Optional     |
| created_at| TIMESTAMP | Record creation timestamp                 | Not Null     |

Note: This table is primarily managed by the `adonis-auditing` package.

#### Cache and Limiter Databases

* **Cache Database (tmp/cache.sqlite):** Used by `@adonisjs/cache`. Stores cached key-value data.
* **Limiter Database (tmp/limiter.sqlite):** Used by `@adonisjs/limiter`. Stores state information for rate limiting (e.g., timestamps of requests).

These databases have structures defined by the respective packages and are separate from the main application data schema.

### C4 CONTAINER

The container diagram shows the main deployable units of the system and how they interact. SQLite databases are file-based and accessed directly by the Backend API container. LiveStore runs in the browser and syncs via WebSockets.

```mermaid
C4Container
title Container Diagram for AI Chat Application

System_Boundary(ai_chat_system_boundary, "AI Chat Application")
    Container(frontend, "Frontend", "React, InertiaJS, Shadcn, Assistant-UI, LiveStore", "Provides the user interface and local-first data storage.")
    Container(backend_api, "Backend API", "AdonisJS v6", "Provides the application logic, API endpoints, and LiveStore sync provider.")
    Container(sqlite_databases, "SQLite Databases", "SQLite files", "Stores application data, cache, and limiter state on the server filesystem.") # Represents tmp/main.sqlite, tmp/cache.sqlite, tmp/limiter.sqlite
    Container(weaviate_container, "Weaviate Database", "Weaviate", "Stores vector embeddings for RAG.")
System_Boundary(ai_chat_system_boundary)

System(logto_auth, "Logto", "Authentication Service")
System(ai_model_providers, "AI Model Providers", "External AI Model Services")
System(openrouter_api, "OpenRouter API", "Aggregated AI Model Service")
System(cloudflare_r2, "Cloudflare R2", "Object Storage")
System(posthog_analytics, "Posthog", "Analytics, Error Tracking, Feature Flags")
System(trigger_dev, "Trigger.dev", "Background Jobs and Queues")
System(openmeter_usage, "OpenMeter", "Usage Tracking")
System(payment_gateways, "Payment Gateways", "Payment Processing Services")
System(external_web_search, "External Web Search", "Web Search API")

Rel(authenticated_user, frontend, "Uses", "HTTPS")
Rel(unauthenticated_user, frontend, "Uses (limited)", "HTTPS")

Rel(frontend, backend_api, "Requests data from and Sends commands to", "HTTPS, WSS (for LiveStore sync)")
Rel(frontend, frontend, "Interacts with LiveStore locally", "In-Process") # User interaction with LiveStore

Rel(backend_api, sqlite_databases, "Reads from and Writes to", "File System Access")
Rel(backend_api, weaviate_container, "Queries and Writes data to", "HTTP/HTTPS")
Rel(backend_api, cloudflare_r2, "Uploads and Retrieves files from", "HTTPS")
Rel(backend_api, logto_auth, "Authenticates users against", "HTTPS")
Rel(backend_api, ai_model_providers, "Makes AI requests to", "HTTPS")
Rel(backend_api, openrouter_api, "Makes AI requests to (including BYOK)", "HTTPS")
Rel(backend_api, posthog_analytics, "Sends events and Checks flags with", "HTTPS")
Rel(backend_api, trigger_dev, "Enqueues jobs in", "HTTPS")
Rel(backend_api, openmeter_usage, "Reports usage data to", "HTTPS")
Rel(backend_api, payment_gateways, "Initiates and Confirms payments with", "HTTPS")
Rel(backend_api, external_web_search, "Queries for real-time info", "HTTPS")

Rel(trigger_dev, backend_api, "Can call back into the API (e.g., update processing status)", "HTTPS")
Rel(trigger_dev, weaviate_container, "Indexes data in (for RAG processing)", "HTTP/HTTPS")
Rel(trigger_dev, ai_model_providers, "Makes AI requests (e.g., image generation)", "HTTPS") # For background AI tasks
```

| Name                 | Type         | Description                                                                   | Responsibilities                                                                 | Security controls                                                                 |
| :------------------- | :----------- | :---------------------------------------------------------------------------- | :------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| Frontend             | Container    | User interface layer built with React, InertiaJS, including LiveStore.        | Render UI, capture user input, display chat messages, manage local data with LiveStore, synchronize with backend via WebSockets. | Input validation, HTTPS, CSP, Client-side authentication token management, LiveStore data isolation (per user). |
| Backend API          | Container    | Application logic layer built with AdonisJS.                                | Handle user requests, interact with SQLite databases, Weaviate, and external services, orchestrate AI calls, manage sessions, enforce business rules, handle payments, implement LiveStore sync provider over WebSockets. | Logto integration, Authentication & Authorization checks, Input validation, Rate limiting (@adonisjs/limiter), Encryption of sensitive data, Secure configuration, Secure WebSocket Server. |
| SQLite Databases     | Container    | File-based databases residing on the server's file system.                    | Store persistent application data (main), cached data (cache), and rate limiter state (limiter). | File system access control, Regular backups, Encryption at rest (if implemented). |
| Weaviate Database    | Container    | Vector database for RAG functionality.                                        | Store document embeddings, perform vector similarity search.                     | Network isolation, Access control.                                                |
| Logto                | Software System| External authentication provider.                                             | User registration, login, identity verification.                                 | N/A (External System)                                                             |
| AI Model Providers   | Software System| External APIs providing various AI models.                                    | Generate AI responses.                                                           | N/A (External System)                                                             |
| OpenRouter API       | Software System| Aggregated AI Model Service.                                          | Route AI requests to underlying providers.                                       | N/A (External System)                                                             |
| Cloudflare R2        | Storage      | Object storage for user file uploads.                                         | Store and retrieve binary file data.                                             | Access control policies, Signed URLs for secure access, Encryption.               |
| Posthog              | Software System| Analytics, error tracking, feature flags.                                     | Data collection and analysis.                                                    | N/A (External System)                                                             |
| Trigger.dev          | Software System| Background job and queue management.                                          | Process files, handle image generation, send notifications asynchronously.         | N/A (External System)                                                             |
| OpenMeter            | Software System| Usage metering platform.                                                      | Track user consumption of resources (AI tokens, file storage).                   | N/A (External System)                                                             |
| Payment Gateways     | Software System| External services for processing payments.                                    | Handle financial transactions.                                                   | N/A (External System, PCI Compliance)                                             |
| External Web Search  | Software System| Provides real-time web search results.                                      | Search the web and return snippets/data.                                         | N/A (External System)                                                             |

### C4 DEPLOYMENT

The deployment diagram shows how the containers might be mapped onto infrastructure nodes. The SQLite databases are files accessed directly by the Backend API, implying they reside on the same server or attached storage. WebSockets handle communication between the browser and the web server cluster.

```mermaid
C4Deployment
title Deployment Diagram for AI Chat Application - Production Environment

Deployment_Node(web_server_cluster, "Web Server Cluster", "Linux, Nginx, Node.js", "Hosts the backend API and serves the frontend assets. SQLite files reside on attached storage.")
Container(backend_api, "Backend API", "AdonisJS v6")
Container(frontend, "Frontend", "React, InertiaJS") # Served by Nginx/Backend
Container(sqlite_databases, "SQLite Databases", "SQLite files") # Resides on attached storage for the cluster

Deployment_Node(weaviate_server, "Weaviate Server", "Linux, Docker/Kubernetes", "Dedicated server(s) for the Weaviate vector database.")
Deployment_Node(cloudflare_edge, "Cloudflare Edge", "Global Network", "Serves static assets (frontend) and handles R2 storage.")
Deployment_Node(browser, "User's Browser", "Chrome, Firefox, Safari, etc.", "Runs the frontend application and LiveStore.")
Container(livestore_browser, "LiveStore Instance", "SQLite in Browser") # Runs within the browser

Deployment_Node(external_services_datacenter, "External Services Data Centers", "Managed Infrastructure", "Hosts third-party services.")
Container(logto_auth, "Logto", "Authentication Service")
Container(ai_model_providers, "AI Model Providers", "External AI Model Services")
Container(openrouter_api, "OpenRouter API", "Aggregated AI Model Service")
Container(posthog_analytics, "Posthog", "Analytics, Error Tracking, Feature Flags")
Container(trigger_dev, "Trigger.dev", "Background Jobs and Queues")
Container(openmeter_usage, "OpenMeter", "Usage Tracking")
Container(payment_gateways, "Payment Gateways", "Payment Processing Services")
Container(external_web_search, "External Web Search", "Web Search API")
Container(cloudflare_r2, "Cloudflare R2", "Object Storage") # Shown here as part of CF Edge

Rel(authenticated_user, browser, "Uses")
Rel(unauthenticated_user, browser, "Uses")

Rel(browser, cloudflare_edge, "Requests Frontend Assets from", "HTTPS")
Rel(browser, web_server_cluster, "Interacts with (API and WebSockets for sync)", "HTTPS, WSS")
Rel(browser, livestore_browser, "Runs LiveStore inside", "In-Process") # Frontend interacts with local LiveStore

Rel(web_server_cluster, backend_api, "Runs")
Rel(web_server_cluster, sqlite_databases, "Accesses files on", "File System Access")
Rel(web_server_cluster, weaviate_server, "Communicates with", "HTTP/HTTPS (Internal Network)")
Rel(web_server_cluster, cloudflare_r2, "Communicates with", "HTTPS") # For direct backend access to R2
Rel(web_server_cluster, logto_auth, "Authenticates against", "HTTPS")
Rel(web_server_cluster, ai_model_providers, "Calls", "HTTPS")
Rel(web_server_cluster, openrouter_api, "Calls", "HTTPS")
Rel(web_server_cluster, posthog_analytics, "Sends data to", "HTTPS")
Rel(web_server_cluster, trigger_dev, "Enqueues jobs in", "HTTPS")
Rel(web_server_cluster, openmeter_usage, "Reports usage to", "HTTPS")
Rel(web_server_cluster, payment_gateways, "Communicates with", "HTTPS")
Rel(web_server_cluster, external_web_search, "Queries", "HTTPS")

Rel(trigger_dev, web_server_cluster, "Calls back to API", "HTTPS")
Rel(trigger_dev, weaviate_server, "Writes data to", "HTTP/HTTPS")
Rel(trigger_dev, ai_model_providers, "Calls (for background tasks)", "HTTPS")

Rel(cloudflare_edge, cloudflare_r2, "Accesses object storage")
```

| Name                       | Type             | Description                                                                 | Responsibilities                                                                 | Security controls                                                                 |
| :------------------------- | :--------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| Web Server Cluster         | Deployment Node  | Cluster of servers hosting the AdonisJS backend and serving frontend assets. SQLite files are accessed directly from here. | Handle incoming user requests, process API calls, serve static files, manage WebSocket connections for LiveStore sync. | Load balancing, Firewall, Intrusion detection, Regular patching, Secure configuration, File system permissions for SQLite. |
| SQLite Databases           | Container        | File-based databases residing on storage accessible by the Web Server Cluster. | Store persistent application data, cache, and rate limiter state.                | File system access control, Regular backups, Encryption at rest (if implemented). |
| Weaviate Server            | Deployment Node  | Dedicated server(s) for the Weaviate vector database.                       | Store and manage vector embeddings for RAG.                                      | Network isolation, Access control, Regular backups.                               |
| Cloudflare Edge            | Deployment Node  | Cloudflare's global network infrastructure.                                 | CDN for frontend assets, DNS, DDoS protection, WAF, access to R2 storage.        | DDoS protection, WAF, TLS termination, Edge caching.                              |
| Browser                    | Deployment Node  | The user's web browser.                                                     | Execute frontend code, display UI, run LiveStore instance.                       | Browser sandbox security, Same-origin policy.                                     |
| LiveStore Instance         | Container        | Browser-based SQLite instance managed by LiveStore.                         | Stores user's chat history and related data locally.                             | Stored within the browser sandbox, relies on browser security and user login. Data synced securely over WSS. |
| External Services Data Centers | Deployment Node| Infrastructure hosting third-party services.                                | Provide managed external services like authentication, AI APIs, analytics, etc.    | N/A (Managed by third-party providers)                                            |
| Frontend                   | Container        | The React/Inertia user interface application.                               | Runs within the user's browser.                                                  | HTTPS, CSP, Client-side validation.                                               |
| Backend API                | Container        | The AdonisJS application backend.                                           | Runs on the Web Server Cluster and accesses local/attached SQLite files.         | Authentication, Authorization, Encryption, Input Validation, Rate Limiting, Secure WebSocket Server. |
| Logto                      | Software System  | External Authentication Provider.                                           | Runs in External Services Data Centers.                                          | N/A (External System)                                                             |
| AI Model Providers         | Software System  | External AI Model Services.                                                 | Run in External Services Data Centers.                                           | N/A (External System)                                                             |
| OpenRouter API             | Software System  | Aggregated AI Model Service.                                          | Runs in External Services Data Centers.                                           | N/A (External System)                                                             |
| Cloudflare R2              | Storage          | Object storage for user file uploads.                                       | Runs within Cloudflare infrastructure.                                           | Access Control, Encryption.                                                       |
| Posthog                    | Software System  | Analytics, Error Tracking, Feature Flags.                                   | Runs in External Services Data Centers.                                           | N/A (External System)                                                             |
| Trigger.dev                | Software System  | Background Jobs and Queues.                                                 | Runs in External Services Data Centers.                                           | N/A (External System)                                                             |
| OpenMeter                  | Software System  | Usage Tracking.                                                             | Runs in External Services Data Centers.                                           | N/A (External System)                                                             |
| Payment Gateways           | Software System  | Payment Processing Services.                                                | Run in External Services Data Centers.                                           | N/A (External System, PCI Compliance)                                             |
| External Web Search        | Software System  | Web Search API.                                                             | Runs in External Services Data Centers.                                           | N/A (External System)                                                             |

### Realtime Implementation Suggestions (AdonisJS/Inertia/React/LiveStore/WebSockets)

The core of the realtime strategy now revolves around LiveStore's synchronization mechanism using `adonisjs-websocket`.

1. **Backend (AdonisJS):**
    * **WebSocket Server (`adonisjs-websocket`):** Set up a WebSocket server. Authenticate incoming connections using the user's session or token.
    * **LiveStore Sync Provider:** Implement a custom LiveStore sync provider within your AdonisJS application. This provider acts as the bridge between the server's main SQLite database (for backup) and the client's LiveStore instance.
        * It will receive changes (mutations) from the client's LiveStore via the WebSocket.
        * It will apply these changes to the server's main SQLite database (`tmp/main.sqlite`) using AdonisJS Lucid/Knex. You can leverage Lucid's query builders as planned.
        * It will receive changes originating from the server (e.g., background processing updating a message status, multi-device sync) and push these changes down to the connected client LiveStore instances via the WebSocket.
        * Handle conflicts according to LiveStore's conflict resolution strategy (client-wins or server-wins are common defaults, or implement custom logic).
        * Ensure data sent over the WebSocket is scoped to the authenticated user's data only.
    * **Event Handling:** Use `@adonijs/events` for decoupling. For instance, a background job completing RAG processing could emit an event that the sync provider listens to, translating it into a change pushed to LiveStore.
    * **AI Streaming:** For real-time AI response streaming, the backend still receives chunks from the AI provider. These chunks would be immediately applied as mutations to the server's main SQLite message record *and* pushed down the WebSocket to the client's LiveStore for immediate display. This allows LiveStore to manage the appending of text chunks and resuming.

2. **Frontend (React/Inertia/LiveStore):**
    * **LiveStore Setup:** Initialize LiveStore in the browser, configuring it to use SQLite and connect to your custom WebSocket sync endpoint (`wss://your-app.com/livestore-sync`).
    * **Data Interaction:** The React components interact directly with the local LiveStore instance (which is a SQLite database in the browser) for reading and writing chat data (chats, messages). This provides the "local-first" speed.
    * **Sync:** LiveStore automatically handles sending local changes to the backend via the WebSocket and applying changes received from the backend.
    * **Resumable Streams (Client-side):** When the frontend receives streaming chunks via the WebSocket sync, LiveStore updates the local message record. If the page refreshes, LiveStore retains the locally saved progress. When the WebSocket reconnects, the sync provider on the server can determine the last known state and resume sending only missing chunks if needed, or LiveStore's sync protocol might handle this inherently by replaying changes. The key is that the *data state* is persisted locally by LiveStore and synced.

**Chat Generation Integration (Trigger.dev vs. Direct):**

* **Direct Backend Processing:** AI requests and response streaming happen directly within the main Backend API process. This simplifies the architecture but can block the main event loop for long-running or numerous requests, impacting responsiveness. This approach works well for features that need immediate, interactive AI responses (like standard chat).
* **Trigger.dev Integration:** Offload AI requests (especially complex ones like image generation or processing large files for RAG) to Trigger.dev jobs. This keeps the main API process free and allows for better management of long-running tasks, retries, and scaling background processing independently. Updates from Trigger.dev jobs (e.g., image generation complete, RAG processing finished) would update the main SQLite DB, and the LiveStore sync provider would push these changes to the client.

You have the option to use a hybrid approach: direct for interactive chat streaming, Trigger.dev for background/non-interactive tasks.

### RISK ASSESSMENT

* **Critical Business Processes to Protect:**
  * User Authentication and Authorization: Ensures only legitimate, authorized users can access features and data.
  * Chat Interaction and AI Response Generation: The core value proposition. Now relies heavily on LiveStore for the primary user experience and server-side SQLite for backup/sync source.
  * User Data Management (Chat History, Files, BYOK Keys): Critical for user trust. Data is now distributed (LiveStore locally, main SQLite server-side for backup, Cloudflare R2 for files, main SQLite for BYOK/user data). Data integrity and privacy across these locations are paramount.
  * Payment Processing and Subscription Management: Directly impacts revenue and user access. Data in main SQLite.
  * Usage Tracking and Metering: Essential for billing and limits. Data in OpenMeter, potentially aggregated via backend.
  * RAG Processing and Retrieval: Impacts AI quality. Data in Weaviate and main SQLite (metadata), triggered potentially via Trigger.dev.
  * LiveStore Sync: The reliability and security of data synchronization between client and server are critical for a consistent user experience and data backup.

* **Data to Protect and Sensitivity:** The categories of data and their sensitivity remain the same (Very High for chat history, BYOK; High for User Profile, Files, Payments). The difference is *where* this data resides and is processed:
  * **User Profile Data:** Main SQLite (server). Sensitivity: High (PII).
  * **Chat History:** LiveStore (browser, primary); Main SQLite (server, backup/sync source). Sensitivity: Very High.
  * **Uploaded Files:** Cloudflare R2; Metadata in Main SQLite (server). Sensitivity: Very High.
  * **User-Provided API Keys (BYOK):** Encrypted in Main SQLite (server). Sensitivity: Extremely High.
  * **Payment Information:** Main SQLite (server). Sensitivity: High (Financial).
  * **Activity and Audit Logs:** Main SQLite (server). Sensitivity: Moderate.
  * **RAG Embeddings:** Weaviate (server). Sensitivity: High (derived from user docs).
  * **Cached Data:** Cache SQLite (server). Sensitivity: Varies based on what's cached, can be High if sensitive query results are cached.
  * **Limiter State:** Limiter SQLite (server). Sensitivity: Low.

Key security considerations now include:

* Ensuring secure, authenticated, and authorized data transfer over the WebSocket for LiveStore sync.
* Protecting the SQLite database files on the server from unauthorized file system access.
* Implementing robust encryption for BYOK keys, ensuring decryption keys are not stored alongside the database files.
* Handling data consistency and conflict resolution securely and correctly during synchronization.

### QUESTIONS & ASSUMPTIONS

**Questions:**

1. What is the specific definition and desired user experience for "Easy to try"? (e.g., free trial period, limited free usage with or without login, demo mode?)
2. What is the expected scope for supporting "multiple language models and providers"? Will this be a curated list, or aim for integration with any provider supported by `@ai-sdk` or OpenRouter?
3. What are the specific requirements for "priority support for OpenRouter API keys"? Does this imply a dedicated support channel, faster response times, or specific technical guarantees?
4. What is the expected scale of concurrent users and chat interactions? This is critical for assessing the potential performance bottlenecks of SQLite for write heavy operations.
5. What is the required level of offline capability for the local-first chat history with LiveStore? Are users expected to be able to initiate new chats or only view/continue existing ones while offline?
6. What is the strategy for handling data synchronization conflicts between LiveStore and the server-side SQLite database? Will a default strategy be used, or is custom conflict resolution logic required?

**Assumptions:**

1. **BUSINESS POSTURE:** Assumed that the choice of SQLite and LiveStore reflects a preference for a potentially simpler development and deployment model at initial scale and a strong emphasis on the local-first user experience for chat.
2. **SECURITY POSTURE:** Assumed that robust security for BYOK keys (encryption, access control) remains a critical requirement. Assumed that Logto handles core authentication flows securely. Assumed that standard web application security best practices will be followed, including securing WebSocket connections. Assumed that file system permissions on the server will be used to protect the SQLite database files.
3. **DESIGN:** Assumed that the "service oriented structure" goal means designing the AdonisJS application with clear separation of concerns that *could* be refactored later. Assumed a typical cloud deployment model where the Backend API servers have performant access to the SQLite database files (e.g., on attached SSD storage). Assumed that the `ai` (vercel) and `@ai-sdk` packages will abstract much of the direct AI provider API interaction. Assumed that `@foadonis/shopkeeper` assists in managing the payment gateway integrations. Assumed that using Lucid with Knex queries is primarily for interacting with the server-side SQLite databases, including implementing the LiveStore sync provider logic to apply/fetch changes. Assumed the `adonisjs-websocket` package provides the necessary WebSocket server capabilities. Assumed LiveStore handles the client-side SQLite management and sync protocol.
