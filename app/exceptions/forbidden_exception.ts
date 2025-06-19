// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import { HttpContext } from '@adonisjs/core/http'
import ProblemException from './problem_exception.js'

export default class ForbiddenException extends ProblemException {
  static status = 403 // Default status code for forbidden access
  static type = 'https://httpstatuses.com/403' // Default problem type for forbidden access
  static title = 'Forbidden' // Default title for forbidden access

  constructor(detail?: string, instance?: string, extensions: Record<string, any> = {}) {
    super(
      ForbiddenException.title,
      ForbiddenException.type,
      detail || 'You do not have permission to perform this action.',
      instance,
      ForbiddenException.status,
      extensions
    )
  }

  /**
   * Custom handle method to render Forbidden response
   */
  async handle(error: this, ctx: HttpContext) {
    return super.handle(error, ctx)
  }
}
