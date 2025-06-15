import { HttpContext } from '@adonisjs/core/http'
import ProblemException from './problem_exception.js'

export default class ServerErrorException extends ProblemException {
  static status = 500
  static type = 'https://httpstatuses.com/500'
  static title = 'Internal Server Error'

  constructor(detail?: string, instance?: string, extensions: Record<string, any> = {}) {
    super(
      ServerErrorException.title,
      ServerErrorException.type,
      detail || 'An unexpected error occurred. Please try again later.',
      instance,
      ServerErrorException.status,
      extensions
    )
  }

  async handle(error: this, ctx: HttpContext) {
    return super.handle(error, ctx)
  }
}
