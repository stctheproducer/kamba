// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import { healthChecks } from '#start/health'
import type { HttpContext } from '@adonisjs/core/http'

export default class HealthChecksController {
  async handle({ response }: HttpContext) {
    const report = await healthChecks.run()

    if (report.isHealthy) {
      return response.ok(report)
    }

    return response.serviceUnavailable(report)
  }
}
