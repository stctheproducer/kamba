---
trigger: always_on
---

# Security Considerations

## Authentication & Authorization

- User authentication is handled by Logto or GitHub OAuth
- Implement granular authorization checks to ensure users can only access their own data
- This applies to both REST API and WebSocket sync layer

## Data Security

- User-provided API keys (BYOK) must be encrypted at rest using `@adonisjs/encryption`
- Access to decryption keys must be strictly controlled
- All communication must use secure protocols (HTTPS, WSS)
- SQLite database files must have appropriate file system permissions

## Input Validation

- Validate all user inputs, especially in chat messages, file uploads, and API key handling
- Implement rate limiting on API endpoints and WebSocket connections
