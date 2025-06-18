/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const, {
    message: 'Invalid node environment',
  }),
  PORT: Env.schema.number(),
  APP_NAME: Env.schema.string.optional(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const, {
    message: 'Invalid log level',
  }),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const, {
    message: 'Invalid session driver',
  }),

  /*
  |----------------------------------------------------------
  | Variables for configuring cache package
  |----------------------------------------------------------
  */
  CACHE_DRIVER: Env.schema.enum(['database', 'memory'] as const, {
    message: 'Invalid cache driver',
  }),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_CONNECTION: Env.schema.enum(['sqlite', 'postgres'] as const, {
    message: 'Invalid database connection',
  }),
  DB_FILE: Env.schema.string.optionalWhen(process.env.DB_CONNECTION !== 'sqlite', {
    message: 'Invalid database file',
  }),
  CACHE_DB_FILE: Env.schema.string.optionalWhen(process.env.DB_CONNECTION !== 'sqlite', {
    message: 'Invalid cache database file',
  }),
  LIMITER_DB_FILE: Env.schema.string.optionalWhen(process.env.DB_CONNECTION !== 'sqlite', {
    message: 'Invalid limiter database file',
  }),
  DB_HOST: Env.schema.string.optional({ format: 'host' }),
  DB_PORT: Env.schema.number.optional(),
  DB_USER: Env.schema.string.optional(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  AWS_ACCESS_KEY_ID: Env.schema.string.optionalWhen(process.env.SMTP_PROVIDER !== 'ses', {
    message: 'Invalid AWS access key ID',
  }),
  AWS_SECRET_ACCESS_KEY: Env.schema.string.optionalWhen(process.env.SMTP_PROVIDER !== 'ses', {
    message: 'Invalid AWS secret access key',
  }),
  AWS_REGION: Env.schema.string.optionalWhen(process.env.SMTP_PROVIDER !== 'ses', {
    message: 'Invalid AWS region',
  }),

  /*
  |----------------------------------------------------------
  | Variables for configuring the drive package
  |----------------------------------------------------------
  */
  DRIVE_DISK: Env.schema.enum(['fs', 'r2'] as const, {
    message: 'Invalid drive disk',
  }),
  R2_KEY: Env.schema.string.optionalWhen(
    process.env.DRIVE_DISK === 'fs' || process.env.NODE_ENV !== 'production',
    {
      message: 'Invalid R2 key',
    }
  ),
  R2_SECRET: Env.schema.string.optionalWhen(
    process.env.DRIVE_DISK === 'fs' || process.env.NODE_ENV !== 'production',
    {
      message: 'Invalid R2 secret',
    }
  ),
  R2_BUCKET: Env.schema.string.optionalWhen(
    process.env.DRIVE_DISK === 'fs' || process.env.NODE_ENV !== 'production',
    {
      message: 'Invalid R2 bucket',
    }
  ),
  R2_ENDPOINT: Env.schema.string.optionalWhen(
    process.env.DRIVE_DISK === 'fs' || process.env.NODE_ENV !== 'production',
    {
      message: 'Invalid R2 endpoint',
    }
  ),

  /*
  |----------------------------------------------------------
  | Variables for configuring the limiter package
  |----------------------------------------------------------
  */
  LIMITER_STORE: Env.schema.enum(['database', 'memory'] as const, {
    message: 'Invalid limiter store',
  }),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  SMTP_PROVIDER: Env.schema.enum(['smtp', 'sendgrid', 'mailgun', 'ses'] as const),
  // Required when we _are_ in production _and_ using the raw SMTP provider
  SMTP_HOST: Env.schema.string.optionalWhen(
    process.env.SMTP_PROVIDER !== 'smtp' || process.env.NODE_ENV !== 'production'
  ),
  SMTP_PORT: Env.schema.number.optionalWhen(
    process.env.SMTP_PROVIDER !== 'smtp' || process.env.NODE_ENV !== 'production'
  ),
  /*
  |----------------------------------------------------------
  | Variables for configuring ally package
  |----------------------------------------------------------
  */
  OAUTH_PROVIDER: Env.schema.enum(['logto', 'github'] as const, {
    message: 'Invalid OAuth provider',
  }),
  GITHUB_CLIENT_ID: Env.schema.string.optionalWhen(process.env.OAUTH_PROVIDER === 'logto'),
  GITHUB_CLIENT_SECRET: Env.schema.string.optionalWhen(process.env.OAUTH_PROVIDER === 'logto'),
  GITHUB_REDIRECT_URI: Env.schema.string.optionalWhen(process.env.OAUTH_PROVIDER === 'logto', {
    message: 'Invalid GitHub redirect URI',
    format: 'url',
  }),
  LOGTO_CLIENT_ID: Env.schema.string.optionalWhen(process.env.OAUTH_PROVIDER === 'github'),
  LOGTO_CLIENT_SECRET: Env.schema.string.optionalWhen(process.env.OAUTH_PROVIDER === 'github'),
  LOGTO_REDIRECT_URI: Env.schema.string.optionalWhen(process.env.OAUTH_PROVIDER === 'github', {
    format: 'url',
  }),
  LOGTO_ENDPOINT: Env.schema.string.optionalWhen(process.env.OAUTH_PROVIDER === 'github', {
    format: 'url',
  }),

  TURNSTILE_SITE_KEY: Env.schema.string.optional(),
  TURNSTILE_SECRET: Env.schema.string.optional(),
  RECAPTCHA_SITE_KEY: Env.schema.string.optional(),
  RECAPTCHA_SECRET: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the lock package
  |----------------------------------------------------------
  */
  LOCK_STORE: Env.schema.enum(['database', 'memory'] as const),

  OPENROUTER_API_KEY: Env.schema.string(),

  OPENAI_API_KEY: Env.schema.string()
})
