import UnauthorizedException from '#exceptions/unauthorized_exception'
import { tryCatch } from '#utils/try_catch'
import type { HttpContext } from '@adonisjs/core/http'

// import {} from '@ai-sdk'

export default class AuthController {
  async login({ ally, inertia }: HttpContext) {
    // Redirect user to Logto for authentication
    inertia.location(await ally.use('logto').getRedirectUrl())
  }

  async handleCallback({ ally, request, response, auth: _, logger: parentLogger }: HttpContext) {
    const instance = request.url()
    // Create a logger with the method context
    const logger = parentLogger.child({
      context: 'AuthController.handleCallback',
      method: request.method(),
      instance,
    })

    const logto = ally.use('logto')

    // The user has denied access or something went wrong
    if (logto.accessDenied()) {
      logger.warn('User denied access')
      throw new UnauthorizedException('Access denied by user')
    }

    // Logto returned an error
    if (logto.hasError()) {
      let error = logto.getError()
      logger.error({ error }, 'Something went wrong post redirect')
      throw new UnauthorizedException('Authentication failed', instance, { error })
    }

    const [user, userError] = await tryCatch(() => logto.user())

    logger.debug(user, 'User has been retrieved')

    if (userError) {
      logger.error({ error: userError }, 'Failed to retrieve user')
      throw new UnauthorizedException('Failed to retrieve user', instance, { error: userError })
    }

    logger.debug('Successfully retrieved user')
    response.ok(user)
  }

  async logout({ auth: _, response, request, logger: parentLogger }: HttpContext) {
    const instance = request.url()
    const logger = parentLogger.child({
      context: 'AuthController.logout',
      method: request.method(),
      instance,
    })

    // Log the user out of the session
    // const user = auth.use('web')
    // await user.logout()

    logger.debug('User session has ended')

    response.redirect('/')
  }
}
