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
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_NAME: Env.schema.string.optional(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring cache package
  |----------------------------------------------------------
  */
  CACHE_DRIVER: Env.schema.enum(['redis', 'database', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_CONNECTION: Env.schema.enum(['sqlite', 'postgres'] as const),
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
  AWS_ACCESS_KEY_ID: Env.schema.string.optionalWhen(process.env.NODE_ENV !== 'production'),
  AWS_SECRET_ACCESS_KEY: Env.schema.string.optionalWhen(process.env.NODE_ENV !== 'production'),
  AWS_REGION: Env.schema.string.optionalWhen(process.env.NODE_ENV !== 'production'),

  /*
  |----------------------------------------------------------
  | Variables for configuring the drive package
  |----------------------------------------------------------
  */
  DRIVE_DISK: Env.schema.enum(['fs', 'r2'] as const),
  R2_KEY: Env.schema.string.optionalWhen(process.env.NODE_ENV !== 'production'),
  R2_SECRET: Env.schema.string.optionalWhen(process.env.NODE_ENV !== 'production'),
  R2_BUCKET: Env.schema.string.optionalWhen(process.env.NODE_ENV !== 'production'),
  R2_ENDPOINT: Env.schema.string.optionalWhen(process.env.NODE_ENV !== 'production'),

  /*
  |----------------------------------------------------------
  | Variables for configuring the limiter package
  |----------------------------------------------------------
  */
  LIMITER_STORE: Env.schema.enum(['redis', 'database', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  SMTP_HOST: Env.schema.string.optionalWhen(process.env.NODE_ENV === 'production'),
  SMTP_PORT: Env.schema.string.optionalWhen(process.env.NODE_ENV === 'production'),

  /*
  |----------------------------------------------------------
  | Variables for configuring ally package
  |----------------------------------------------------------
  */
  GITHUB_CLIENT_ID: Env.schema.string.optional(),
  GITHUB_CLIENT_SECRET: Env.schema.string.optional(),
  LOGTO_CLIENT_ID: Env.schema.string(),
  LOGTO_CLIENT_SECRET: Env.schema.string(),
  LOGTO_REDIRECT_URI: Env.schema.string({ format: 'url' }),
  LOGTO_ENDPOINT: Env.schema.string({ format: 'url' }),

  REDIS_HOST: Env.schema.string.optional({ format: 'host' }),
  REDIS_PORT: Env.schema.number.optional(),
  REDIS_PASSWORD: Env.schema.string.optional(),

  TURNSTILE_SITE_KEY: Env.schema.string.optional(),
  TURNSTILE_SECRET: Env.schema.string.optional(),
  RECAPTCHA_SITE_KEY: Env.schema.string.optional(),
  RECAPTCHA_SECRET: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the lock package
  |----------------------------------------------------------
  */
  LOCK_STORE: Env.schema.enum(['database', 'memory'] as const)
})
