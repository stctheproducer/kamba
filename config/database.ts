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
        filename: app.tmpPath('app.sqlite'),
        debug: env.get('LOG_LEVEL') === 'debug',
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      pool: {
        max: 1,
      },
    },
    sqlite_read: {
      client: 'better-sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: app.tmpPath('app.sqlite'),
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
        filename: app.tmpPath('cache.sqlite'),
        debug: env.get('LOG_LEVEL') === 'debug',
      },
    },
    limiter: {
      client: 'better-sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: app.tmpPath('limiter.sqlite'),
        debug: env.get('LOG_LEVEL') === 'debug',
      },
    },
  },
})

export default dbConfig
