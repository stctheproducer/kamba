import { HttpContext } from '@adonisjs/core/http'
import ProblemException from './problem_exception.js'

export default class ResourceNotFoundException extends ProblemException {
  static status = 404 // Default status code for resource not found
  static type = 'https://httpstatuses.com/404' // Default problem type for resource not found
  static title = 'Resource Not Found' // Default title for resource not found

  constructor(detail?: string, instance?: string, extensions: Record<string, any> = {}) {
    super(
      ResourceNotFoundException.title,
      ResourceNotFoundException.type,
      detail || 'The requested resource could not be found.',
      instance,
      ResourceNotFoundException.status,
      extensions
    )
  }

  /**
   * Custom handle method to render Resource Not Found response
   */
  async handle(error: this, ctx: HttpContext) {
    return super.handle(error, ctx)
  }
}
