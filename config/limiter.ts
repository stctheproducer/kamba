import env from '#start/env'
import { defineConfig, stores } from '@adonisjs/limiter'

const limiterConfig = defineConfig({
  default: env.get('LIMITER_STORE'),
  stores: {
    /**
     * Database store to save rate limiting data inside a
     * database.
     *
     * It is recommended to use a separate database for
     * the limiter connection.
     */
    database: stores.database({
      connectionName: 'limiter',
      tableName: 'rate_limits',
      keyPrefix: 'limiter:',
    }),

    /**
     * Memory store could be used during
     * testing
     */
    memory: stores.memory({
      keyPrefix: 'limiter:',
    }),
  },
})

export default limiterConfig

declare module '@adonisjs/limiter/types' {
  export interface LimitersList extends InferLimiters<typeof limiterConfig> {}
}
