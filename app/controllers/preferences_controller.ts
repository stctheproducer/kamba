// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import { getPreferenceValidator, upsertPreferenceValidator } from '#validators/preference'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class PreferencesController {
  /**
   * Display a list of resource
   */
  async index() {}

  /**
   * Display form to create a new record
   */
  async create() {}

  /**
   * Handle form submission for the create action
   */
  async store({ request: _ }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ request, logger: parentLogger, response }: HttpContext) {
    const logger = parentLogger.child({
      context: 'PreferencesController.show',
      method: request.method(),
      instance: request.url(),
    })

    const data = await request.validateUsing(getPreferenceValidator)
    const preferenceId = data.params.preferenceId
    let value: boolean

    switch (preferenceId) {
      case 'sidebar-collapsed':
        value = request.cookie('sidebar-collapsed', 'false') === 'true'
        break
      default:
        logger.warn(`Unknown preference ID: ${preferenceId}`)
        return response.notFound()
    }

    logger.debug(`Getting ${preferenceId} preference: ${value}`)
    return response.noContent()
  }

  /**
   * Edit individual record
   */
  async edit({ params: _ }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, logger: parentLogger }: HttpContext) {
    const logger = parentLogger.child({
      context: 'PreferencesController.update',
      method: request.method(),
      instance: request.url(),
    })

    const data = await request.validateUsing(upsertPreferenceValidator)
    const preferenceId = data.params.preferenceId
    let value: boolean

    switch (preferenceId) {
      case 'sidebar-collapsed':
        value = data.sidebarCollapsed
        break
      default:
        logger.warn(`Unknown preference ID: ${preferenceId}`)
        return response.notFound()
    }

    response.cookie(preferenceId, value, {
      maxAge: '30d', // Cookie expires in 30 days
      httpOnly: false, // Allow JavaScript access for localStorage sync
      secure: app.inProduction,
      sameSite: 'lax',
    })

    logger.debug(`Set "${preferenceId}" preference to ${value}`)
    return response.noContent()
  }

  /**
   * Delete record
   */
  async destroy({ params: _ }: HttpContext) {}
}
