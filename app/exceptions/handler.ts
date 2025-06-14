import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as limiterErrors } from '@adonisjs/limiter'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'
import ProblemException from './problem_exception.js'
import ServerErrorException from './server_error_exception.js'
import { errors as authErrors } from '@adonisjs/auth'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (error, { inertia }) => inertia.render('errors/not_found', { error }),
    '500..599': (error, { inertia }) => inertia.render('errors/server_error', { error }),
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const logger = ctx.logger.child({
      context: 'HttpExceptionHandler.handle',
      method: ctx.request.method(),
      instance: ctx.request.url(),
    })

    if (error instanceof limiterErrors.E_TOO_MANY_REQUESTS) {
      const message = error.getResponseMessage(ctx)
      const headers = error.getDefaultHeaders()
      const cause = error.cause as Record<string, string>
      const code = error.code

      logger.warn({ error, headers, cause, code }, message)

      Object.keys(headers).forEach((key) => ctx.response.header(key, headers[key]))

      const tooManyRequestsException = new ProblemException(
        'Too Many Requests',
        `https://httpstatuses.com/${error.status}`,
        message,
        ctx.request.url(),
        error.status,
        { requestId: ctx.request.id(), ...cause, code }
      )
      await tooManyRequestsException.handle(tooManyRequestsException, ctx)
      return
    }

    if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
      const message = error.getResponseMessage(error, ctx)
      const cause = error.cause as Record<string, string>
      const code = error.code

      logger.warn({ error, cause, code }, message)

      const unauthorizedException = new ProblemException(
        'Unauthorized Access',
        `https://httpstatuses.com/${error.status}`,
        message,
        ctx.request.url(),
        error.status,
        { requestId: ctx.request.id(), ...cause, code }
      )
      await unauthorizedException.handle(unauthorizedException, ctx)
      return
    }

    // If the error is an instance of ProblemException, we can handle it
    if (error instanceof ProblemException) {
      await error.handle(error, ctx)
      return
    }

    // For other exceptions, we can log the error and return a generic response
    if (!this.debug) {
      // Log the error
      logger.error({ error }, 'Unhandled exception occurred')
      // Optionally, you can report the error to a monitoring service here
      const genericError = new ServerErrorException(
        'An unexpected error occurred. Please try again later.',
        ctx.request.url(),
        { requestId: ctx.request.id() }
      )
      await genericError.handle(genericError, ctx)
      return
    }

    // In debug mode, we can let the default exception handler take care of it
    // so that it can display the stack trace and other debug information
    logger.error({ error }, 'Unhandled exception')
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
