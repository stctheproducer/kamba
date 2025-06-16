import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { inject } from '@adonisjs/core'
import { UsageService } from '#services/usage_service'

@inject()
export default class ReportUsageMiddleware {
  constructor(protected usageService: UsageService) {}

  async handle(ctx: HttpContext, next: NextFn, options: { event: string }) {
    /**
     * Middleware logic goes here. You can access `ctx` object
     * to get information about the current HTTP request
     */

    const { auth, response } = ctx
    const user = auth.getUserOrFail()

    // Report usage before processing the request
    await this.usageService.reportUsage(options.event, user.id)

    await next()
  }
}
