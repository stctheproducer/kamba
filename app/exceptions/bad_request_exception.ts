import { HttpContext } from '@adonisjs/core/http'
import ProblemException from './problem_exception.js'

export default class BadRequestException extends ProblemException {
  static status = 400 // Default status code for invalid input
  static type = 'https://httpstatuses.com/400' // Default problem type for invalid input
  static title = 'Invalid Input' // Default title for invalid input

  constructor(detail?: string, instance?: string, extensions: Record<string, any> = {}) {
    super(
      BadRequestException.title,
      BadRequestException.type,
      detail || 'The request contains invalid data.',
      instance,
      BadRequestException.status,
      extensions
    )
  }

  /**
   * Custom handle method to render Invalid Input response
   */
  async handle(error: this, ctx: HttpContext) {
    return super.handle(error, ctx)
  }
}
