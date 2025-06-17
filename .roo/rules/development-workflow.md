# Development Workflow

## Branching Strategy

- All development must occur in feature branches, never directly on `develop` or `main`.
- Branch naming convention:
  - `feature/` - For new features
  - `fix/` - For bug fixes
  - `docs/` - For documentation changes
  - `test/` - For adding or modifying tests
  - `refactor/` - For code refactoring
  - `chore/` - For maintenance tasks

## Commit Messages

- Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

  ```
  <type>[optional scope]: <description>

  [optional body]

  [optional footer(s)]
  ```

- Types include: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- Example: `feat(auth): implement remember me functionality`

## Pull Request Process

- PRs must be made against the `develop` branch
- Fill out the PR template completely
- Ensure all CI checks pass
- Request reviews from appropriate team members
- Address all feedback from reviewers
- PRs will be squashed and merged

## Commandline Tools

- Node.js global binaries are in $HOME/.volta/bin/
