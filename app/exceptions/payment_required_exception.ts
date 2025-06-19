// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import { HttpContext } from '@adonisjs/core/http'
import ProblemException from './problem_exception.js'

export default class PaymentRequiredException extends ProblemException {
  static status = 402 // Default status code for payment required
  static type = 'https://httpstatuses.com/402' // Default problem type for payment required
  static title = 'Payment Required' // Default title for payment required

  constructor(detail?: string, instance?: string, extensions: Record<string, any> = {}) {
    super(
      PaymentRequiredException.title,
      PaymentRequiredException.type,
      detail || 'This feature requires payment or sufficient credits.',
      instance,
      PaymentRequiredException.status,
      extensions
    )
  }

  /**
   * Custom handle method to render Payment Required response
   */
  async handle(error: this, ctx: HttpContext) {
    return super.handle(error, ctx)
  }
}
