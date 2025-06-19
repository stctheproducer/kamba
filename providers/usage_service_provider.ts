// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import type { ApplicationService } from '@adonisjs/core/types'
// import { UsageService } from '#services/usage_service'

export default class UsageServiceProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    // this.app.container.singleton(UsageService, () => {
    //   return new UsageService()
    // })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

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
