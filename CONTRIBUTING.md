# Contributing to Kamba

Thank you for your interest in contributing to Kamba! This document provides guidelines and instructions for contributing to this project. Whether you're fixing bugs, adding features, improving documentation, or spreading the word, your help makes this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Development Environment Setup](#development-environment-setup)
  - [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Commit Message Guidelines](#commit-message-guidelines)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code Review Process](#code-review-process)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that sets expectations for participation in our community. By participating, you are expected to uphold this code. Please report unacceptable behavior to [chanda@kamba.app](mailto:chanda@kamba.app).

## Getting Started

### Development Environment Setup

#### Prerequisites

- **Node.js**: Version 20 or higher
- **pnpm**: As the package manager for this project
- **Git**: For version control

#### Setup Steps

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/kamba.git
   cd kamba
   ```
3. **Add the original repository as upstream**:
   ```bash
   git remote add upstream https://github.com/stctheproducer/kamba.git
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```
5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration details.
6. **Run database migrations**:
   ```bash
   node ace migration:run
   ```

#### Development Scripts

- `pnpm dev`: Start the development server with hot-reloading
- `pnpm build`: Build the application for production
- `pnpm start`: Start the production server
- `pnpm typecheck`: Check TypeScript types
- `pnpm lint`: Run ESLint for code linting
- `pnpm format`: Run Prettier to format code
- `pnpm test`: Run application tests

### Project Structure

Kamba follows a service-oriented architecture:

- **app/**: Contains core application logic
  - **controllers/**: API and page controllers
  - **models/**: Database models
  - **middleware/**: HTTP middleware
  - **events/**: Event definitions
  - **listeners/**: Event listeners
  - **exceptions/**: Custom exceptions
- **config/**: Configuration files
- **database/**: Database migrations and seeders
- **inertia/**: Frontend components and pages
- **providers/**: Service providers
- **public/**: Static assets
- **resources/**: Views and assets
- **start/**: Application bootstrap files
- **tests/**: Test files

## Development Workflow

### Branching Strategy

We use a feature branch workflow:

1. **Ensure your fork is up-to-date**:

   ```bash
   git checkout develop
   git pull upstream develop
   ```

2. **Create a new branch** for your contribution:

   ```bash
   git checkout -b <branch-type>/<descriptive-name>
   ```

   Branch types:

   - `feature/` - For new features
   - `fix/` - For bug fixes
   - `docs/` - For documentation changes
   - `test/` - For adding or modifying tests
   - `refactor/` - For code refactoring
   - `chore/` - For maintenance tasks

3. **Make your changes** and commit them following our [commit message guidelines](#commit-message-guidelines)

4. **Push your branch** to your fork:

   ```bash
   git push origin <your-branch-name>
   ```

5. **Create a pull request** against the `develop` branch of the main repository

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

#### Examples:

```
feat(auth): implement remember me functionality
```

```
fix(chat): resolve message ordering in LiveStore sync

Fixes #123
```

## Code Style Guidelines

We use ESLint and Prettier to enforce code style. Our style is based on:

- TypeScript recommended rules
- React/JSX rules for frontend code
- AdonisJS style for backend code

### Linting and Formatting

Before submitting your code, ensure it passes our style checks:

```bash
# Check for TypeScript type errors
pnpm typecheck

# Check for linting errors
pnpm lint

# Format your code
pnpm format
```

### Key Style Principles

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use explicit types where beneficial for readability
- Prefer async/await over promise chains
- Use descriptive variable and function names

## Testing

We value well-tested code. When contributing:

1. **Write tests** for new features and bug fixes
2. **Ensure all tests pass** before submitting your PR:
   ```bash
   pnpm test
   ```
3. **Aim for good test coverage**, especially for critical logic

## Pull Request Process

1. **Create a pull request** from your feature branch to the `develop` branch
2. **Fill out the PR template** completely, including:
   - Description of changes
   - Related issue references
   - Type of change
   - Testing details
   - Documentation updates
3. **Ensure the PR passes CI checks**
4. **Request reviews** from appropriate team members
5. **Address any feedback** from reviewers
6. **Update your PR** if needed by adding new commits (don't squash during review)

## Code Review Process

All contributions go through a code review process:

1. **At least one approval** is required from a maintainer
2. **All comments must be resolved** before merging
3. **All CI checks must pass**
4. **Squash and merge** will be used when merging PRs

### Review Expectations

As a reviewer:

- Be respectful and constructive
- Focus on code quality, correctness, and adherence to project standards
- Provide specific, actionable feedback
- Respond to review requests within a reasonable timeframe

As a contributor:

- Be receptive to feedback
- Explain your reasoning when discussing suggestions
- Make requested changes or discuss alternatives
- Respond to review comments promptly

## Documentation

Good documentation is crucial:

- **Update README.md** when adding significant features
- **Include JSDoc comments** for public APIs
- **Add inline comments** for complex logic
- **Update any relevant documentation** in the wiki

## Community

Join our community to get help, share ideas, or contribute to Kamba's development!

### Support Channels

- **GitHub Discussions**: Use the [Discussions](https://github.com/stctheproducer/kamba/discussions) tab for questions, ideas, and community interactions
- **Discord Server**: Join our [Discord community](https://discord.gg/VSMwYCk58V) for real-time discussions
- **Twitter**: Follow [@stctheproducer](https://twitter.com/stctheproducer) for announcements

### Getting Help

If you need help with contributing:

1. Check the [documentation](https://github.com/stctheproducer/kamba/wiki) (coming soon)
2. Search for similar questions in [GitHub Discussions](https://github.com/stctheproducer/kamba/discussions)
3. Create a new discussion if you can't find an answer

---

Thank you for contributing to Kamba! Your efforts help make this project better for everyone.
