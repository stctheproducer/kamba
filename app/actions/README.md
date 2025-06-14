# Actions

This directory contains action classes that implement business logic in your AdonisJS application.

## Creating a New Action

Use the `make:action` command to create a new action:

```bash
node ace make:action ChargeUser User
```

### Options

- `name`: The name of the action (e.g., `ChargeUser`)
- `model`: The model to import (e.g., `User`)
- `category`: (Optional) Organize actions in subdirectories (e.g., `billing`)

### Example with Category

```bash
node ace make:action ChargeUser User billing
```

This will create: `app/actions/billing/charge_user.ts`

## Action Structure

Actions implement the `AsAction` interface from `@foadonis/actions` and should contain a single responsibility.

Example:

```typescript
import { AsAction } from '@foadonis/actions'
import User from '#models/user'

export default class ChargeUserAction implements AsAction {
  handle(user: User) {
    // Your business logic here
  }
}
```

## Best Practices

1. **Naming**: Start with a verb (e.g., `CreateUser`, `UpdateProfile`)
2. **Organization**: Group related actions in categories (e.g., `auth`, `billing`, `users`)
3. **Single Responsibility**: Each action should do one thing and do it well
4. **Reusability**: Make actions reusable across different parts of your application
