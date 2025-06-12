import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'
import ProblemException from './problem_exception.js'

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
    // If the error is an instance of ProblemException, we can handle it
    if (error instanceof ProblemException) {
      await error.handle(error, ctx)
      return
    }

    // For other exceptions, we can log the error and return a generic response
    if (!this.debug) {
      // Log the error
      ctx.logger.error({ context: 'HttpExceptionHandler', error }, 'Unhandled exception occurred')
      // Optionally, you can report the error to a monitoring service here
      const genericError = new ProblemException(
        'Internal Server Error',
        'https://httpstatuses.com/500',
        'An unexpected error occurred. Please try again later.',
        ctx.request.url(),
        500,
        { requestId: ctx.request.id() }
      )
      await genericError.handle(genericError, ctx)
      return
    }

    // In debug mode, we can let the default exception handler take care of it
    // so that it can display the stack trace and other debug information
    ctx.logger.error({ context: 'HttpExceptionHandler', error }, 'Unhandled exception')
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
