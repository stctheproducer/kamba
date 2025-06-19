// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
// import env from '#start/env'
import { tryCatch } from '#utils/try_catch'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
// import { OpenMeter } from '@openmeter/sdk'

/**
 * Note: The OpenMeter SDK is not yet installed.
 * We will install it in a subsequent step.
 * For now, the import is commented out.
 */

@inject()
export class UsageService {
  // private openmeter: OpenMeter
  protected logger: Logger

  constructor(protected ctx: HttpContext) {
    this.logger = this.ctx.logger.child({ context: 'UsageService' })
    // this.openmeter = new OpenMeter({
    //   baseUrl: env.get('OPENMETER_BASE_URL'),
    //   token: env.get('OPENMETER_API_TOKEN'),
    // })
  }

  /**
   * Reports a usage event to Open Meter.
   *
   * @param eventType The type of event to report (e.g., 'chats', 'messages').
   * @param subject The user or entity associated with the event.
   * @param data Additional data for the event.
   */
  // public async reportUsage(eventType: string, subject: string, data: Record<string, any> = {}) {
  public async reportUsage(eventType: string, subject: string, _data: Record<string, any> = {}) {
    const [result, error] = await tryCatch(async () => {
      // await this.openmeter.events.ingest(eventType, {
      //   subject,
      //   data,
      // })
      this.logger.info(`Reporting usage for subject: ${subject}, event: ${eventType}`)
      return { success: true }
    })

    if (error) {
      this.logger.error(`Error reporting usage: ${error}`)
      return { success: false, error }
    }

    return result
  }

  /**
   * Checks if a user is entitled to a specific feature.
   *
   * @param subject The user to check entitlement for.
   * @param feature The feature to check.
   * @returns A promise that resolves to a boolean indicating entitlement.
   */
  public async isEntitled(subject: string, feature: string): Promise<boolean> {
    const [result, error] = await tryCatch(async () => {
      if (error) {
        this.logger.error(`Error checking entitlement: ${error}`)
        return false
      }
      // const entitlement = await this.openmeter.entitlements.check(subject, feature)
      // return entitlement.has_access
      this.logger.info(`Checking entitlement for subject: ${subject}, feature: ${feature}`)
      // For now, we will return true to avoid blocking development.
      // This will be replaced with actual entitlement checks later.
      return true
    })

    return result || false
  }
}
