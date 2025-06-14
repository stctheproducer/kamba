import { defineConfig, store, drivers } from '@adonisjs/cache'
import env from '#start/env'

const cacheConfig = defineConfig({
  default: env.get('CACHE_DRIVER', 'memory'),

  stores: {
    memory: store().useL1Layer(drivers.memory()),
    database: store()
      .useL1Layer(drivers.memory())
      .useL2Layer(
        drivers.database({
          connectionName: 'cache',
        })
      ),
    redis: store()
      .useL1Layer(drivers.memory())
      .useL2Layer(
        drivers.redis({
          connectionName: 'main',
        })
      ),
  },
})

export default cacheConfig

declare module '@adonisjs/cache/types' {
  interface CacheStores extends InferStores<typeof cacheConfig> {}
}
