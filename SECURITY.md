# Security Policy

## Supported Versions

This project is currently in active development. Security updates will be applied to the latest development version and subsequent releases.

| Version | Supported          |
| ------- | ------------------ |
| dev     | :white_check_mark: |

## Reporting a Vulnerability

We take the security of this application seriously. If you believe you've found a security vulnerability, please follow these steps:

1. **Do not disclose the vulnerability publicly**
2. **Email the details to <security@kamba.app>**
   - Include a detailed description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact of the vulnerability
   - Any suggestions for remediation if possible
3. **Allow time for response and assessment**
   - You should receive an initial response within 48 hours acknowledging receipt
   - We aim to assess and address valid vulnerabilities within 14 days
   - We will keep you informed of our progress

## Security Controls

The application implements the following security controls:

### Authentication & Authorization

- User authentication provided by Logto
- Granular authorization checks to ensure users can only access their own data
- Activity logging via adonisjs-activitylog
- Auditing via adonis-auditing package

### Data Protection

- Encryption utilities provided by @adonijs/encryption for sensitive data
- Secure storage and strict access control for user-provided API keys
- All user data, including chat history and uploaded files, is stored securely
- Communication between components is encrypted using TLS/SSL

### Application Security

- Input validation on all user-provided data
- Rate limiting on API endpoints via @adonisjs/limiter
- Content Security Policy (CSP) headers to mitigate XSS attacks
- Protection against common web vulnerabilities (injection attacks, CSRF)
- Comprehensive logging via @adonisjs/logger

## Security Requirements

The application adheres to the following security requirements:

1. All user data, including chat history and uploaded files, must be stored securely and be accessible only by the authenticated user.
2. User-provided API keys must be encrypted at rest and in transit. Access to these keys must be strictly controlled.
3. The application must authenticate all users before allowing access to paid features and personalized data.
4. Communication between the frontend and backend, and between the backend and external services, must be encrypted.
5. The application must be resilient to common web vulnerabilities.
6. Compliance with relevant data privacy regulations depending on user location and data handled.

## Security Best Practices for Development

Contributors to this project are expected to follow these security best practices:

1. Never commit sensitive information (API keys, credentials) to the repository
2. Keep dependencies updated to address known vulnerabilities
3. Follow secure coding practices and conduct code reviews with security in mind
4. Use parameterized queries for database operations to prevent SQL injection
5. Validate and sanitize all user inputs
6. Implement proper error handling that doesn't expose sensitive information
7. Apply the principle of least privilege when designing and implementing features

## Third-Party Services

This application integrates with several third-party services. While we take measures to secure these integrations, users should be aware of the security implications:

- **Logto**: Handles user authentication
- **AI Model Providers**: Process user prompts and generate responses
- **OpenRouter API**: Routes AI requests, especially for BYOK users
- **Cloudflare R2**: Stores uploaded files
- **Payment Gateways**: Process payments

Users providing their own API keys (BYOK) should ensure they follow the security recommendations of the respective service providers.
