import type { ApplicationService } from '@adonisjs/core/types'
import { type Database } from '@adonisjs/lucid/database'
import { type Logger } from '@adonisjs/core/logger'
import { tryCatch } from '#utils/try_catch'

export default class DatabasePragmaProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Method to execute PRAGMA statements on different connections
   * Receives the database and logger instances
   */
  protected async runPragmas(db: Database, logger: Logger) {
    const appConnectionName = 'sqlite'
    const cacheConnectionName = 'cache'
    const limiterConnectionName = 'limiter'
    let pragmas = [
      'PRAGMA foreign_keys=ON; -- Enable foreign key constraints',
      'PRAGMA journal_mode=WAL; -- Use Write-Ahead Logging (WAL) for better write performance',
      'PRAGMA synchronous=NORMAL; -- Normal fsync policy',
      'PRAGMA mmap_size=134217728; -- Set mmap size to 128MB',
      'PRAGMA cache_size=2000; -- Set cache size to 2000 pages',
      'PRAGMA journal_size_limit=67108864; -- Set journal size limit to 64MB',
      'PRAGMA busy_timeout=5000; -- Set busy timeout to 5 seconds',
      'PRAGMA default_transaction_mode=IMMEDIATE; -- Set transaction mode to IMMEDIATE',
    ]

    let error: Error | null = null

    for await (const pragma of pragmas) {
      ;[, error] = await tryCatch(() => db.connection(appConnectionName).rawQuery(pragma))
    }

    if (error) {
      logger.error({ error }, `Error configuring PRAGMAs for connection: ${appConnectionName}`)
      throw error
    }

    error = null
    for await (const pragma of pragmas) {
      ;[, error] = await tryCatch(() => db.connection(cacheConnectionName).rawQuery(pragma))
    }
    if (error) {
      logger.error({ error }, `Error configuring PRAGMAs for connection: ${cacheConnectionName}`)
      throw error
    }

    pragmas = [
      'PRAGMA journal_mode=WAL; -- Use Write-Ahead Logging (WAL) for better write performance',
      'PRAGMA synchronous=OFF; -- Disable fsync for better write performance',
      'PRAGMA mmap_size=268435456; -- Set mmap size to 256MB',
    ]

    error = null
    for await (const pragma of pragmas) {
      ;[, error] = await tryCatch(() => db.connection(limiterConnectionName).rawQuery(pragma))
    }
    if (error) {
      logger.error({ error }, `Error configuring PRAGMAs for connection: ${limiterConnectionName}`)
      throw error
    }
  }

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    // Resolve database service
    const db = await this.app.container.make('lucid.db')
    const loggerParent = await this.app.container.make('logger')
    const logger = loggerParent.child({ context: 'DatabasePragmaProvider.boot' })

    // Run pragmas when app is ready
    this.app.ready(() => {
      this.runPragmas(db, logger).catch((error) => {
        logger.error({ error }, 'Error running PRAGMA statements')
      })
    })
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
