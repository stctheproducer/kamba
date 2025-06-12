import { HttpContext } from '@adonisjs/core/http'
import ProblemException from './problem_exception.js'

export default class UnauthorizedException extends ProblemException {
  static status = 401 // Default status code for unauthorized access
  static type = 'https://httpstatuses.com/401' // Default problem type for unauthorized access
  static title = 'Unauthorized' // Default title for unauthorized access

  constructor(detail?: string, instance?: string, extensions: Record<string, any> = {}) {
    super(
      UnauthorizedException.title,
      UnauthorizedException.type,
      detail || 'Authentication is required to access this resource.',
      instance,
      UnauthorizedException.status,
      extensions
    )
  }

  /**
   * Custom handle method to render Unauthorized response
   */
  async handle(error: this, ctx: HttpContext) {
    return super.handle(error, ctx)
  }
}
