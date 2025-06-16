import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  prettyPrintDebugQueries: true,
  connection: env.get('DB_CONNECTION', 'sqlite'),
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: app.tmpPath(env.get('DB_FILE')),
        debug: env.get('LOG_LEVEL') === 'debug',
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
        disableRollbacksInProduction: true,
      },
      pool: {
        max: 1,
      },
    },
    sqlite_read: {
      client: 'better-sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: app.tmpPath(env.get('DB_FILE')),
        mode: 'readonly',
        debug: env.get('LOG_LEVEL') === 'debug',
      },
      pool: {
        max: 5,
      },
    },
    cache: {
      client: 'better-sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: app.tmpPath(env.get('CACHE_DB_FILE')),
        debug: env.get('LOG_LEVEL') === 'debug',
      },
    },
    limiter: {
      client: 'better-sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: app.tmpPath(env.get('LIMITER_DB_FILE')),
        debug: env.get('LOG_LEVEL') === 'debug',
      },
    },
  },
})

export default dbConfig
