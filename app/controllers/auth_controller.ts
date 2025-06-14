import ServerErrorException from '#exceptions/server_error_exception'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import User from '#models/user'
import { tryCatch } from '#utils/try_catch'
import type { HttpContext } from '@adonisjs/core/http'
// import { v7 as uuidv7 } from 'uuid'

export default class AuthController {
  async login({ ally, inertia, logger: parentLogger }: HttpContext) {
    const logger = parentLogger.child({ context: 'AuthController.login' })
    logger.info('Initiating Logto login redirect')
    // Redirect user to Logto for authentication
    inertia.location(await ally.use('logto').getRedirectUrl())
  }

  async handleCallback({ ally, request, response, auth, logger: parentLogger }: HttpContext) {
    const instance = request.url()
    const logger = parentLogger.child({
      context: 'AuthController.handleCallback',
      method: request.method(),
      instance,
    })

    logger.info('Handling Logto callback')

    const logto = ally.use('logto')

    // The user has denied access or something went wrong with Logto
    if (logto.accessDenied()) {
      logger.warn('User denied access during Logto callback')
      throw new UnauthorizedException('Access denied by user')
    }

    // Logto returned an error
    if (logto.hasError()) {
      const error = logto.getError()
      logger.error({ error }, 'Something went wrong post redirect from Logto')
      throw new UnauthorizedException('Authentication failed', instance, { error })
    }

    // Use tryCatch for fetching Logto user details
    const [logtoUser, logtoUserError] = await tryCatch(() => logto.user())

    if (logtoUserError || !logtoUser) {
      logger.error({ error: logtoUserError }, 'Failed to retrieve Logto user details')
      throw new UnauthorizedException('Failed to retrieve Logto user details', instance, {
        error: logtoUserError,
      })
    }

    logger.debug(
      { logtoUserId: logtoUser.id, email: logtoUser.email },
      'Successfully retrieved Logto user'
    )

    // Find or create the user in our database
    // Using tryCatch for database operation
    const [user, findOrCreateError] = await tryCatch(async () => {
      // Find a user by their Logto ID
      let userRecord = await User.findBy('logtoId', logtoUser.id)

      if (!userRecord) {
        logger.info({ logtoUserId: logtoUser.id }, 'User not found, creating new user')
        // User not found, create a new one
        userRecord = new User()
        // userRecord.id = uuidv7() // Generate UUID for SQLite
        userRecord.logtoId = logtoUser.id
        userRecord.email = logtoUser.email!
        userRecord.username = logtoUser.nickName || logtoUser.email!.split('@')[0] // Basic username generation
        // userRecord.isBetaUser = false // Default status
        // userRecord.isPayingUser = false // Default status

        await userRecord.save()
        logger.info({ userId: userRecord.id }, 'New user created successfully')

        // TODO: Emit a user created event for activity logging and other processes
        // Events.emit('user::created', { userId: userRecord.id, logtoUserId: logtoUser.id })
      } else {
        logger.debug({ userId: userRecord.id, logtoUserId: logtoUser.id }, 'Existing user found')
        // TODO: Optionally update user information from Logto if needed
        // e.g., userRecord.username = logtoUser.username || userRecord.username
        // await userRecord.save()
      }

      return userRecord
    })

    // Ideally this shouldn't happen, but it's a good guard to have
    if (!user) {
      logger.error({ logtoUserId: logtoUser.id }, 'Failed to find or create user')
      throw new ServerErrorException('Failed to process user account', instance, {
        error: findOrCreateError,
      })
    }

    if (findOrCreateError) {
      logger.error(
        { error: findOrCreateError, logtoUserId: logtoUser.id },
        'Failed to find or create user'
      )
      // Depending on your policy, you might want to throw a different exception
      throw new ServerErrorException('Failed to process user account', instance, {
        error: findOrCreateError,
      })
    }

    // Log the user into the AdonisJS session
    try {
      await auth.use('web').login(user, true) // Use the 'web' guard, remember the user
      logger.info({ userId: user.id }, 'User successfully logged in')

      // TODO: Emit a user logged in event for activity logging
      // Events.emit('user::loggedIn', { userId: user!.id })
    } catch (loginError) {
      logger.error(
        { error: loginError, userId: user.id },
        'Failed to log user in after authentication'
      )
      throw new ServerErrorException('Failed to establish user session', instance, {
        error: loginError,
      })
    }

    // Redirect the user to the desired page after login (e.g., the chat screen)
    // Assuming '/chat' is the route for the chat screen
    logger.info({ userId: user.id }, 'Redirecting user to chat screen')
    response.redirect('/chat')
  }

  async logout({ auth, response, request, logger: parentLogger }: HttpContext) {
    const instance = request.url()
    const logger = parentLogger.child({
      context: 'AuthController.logout',
      method: request.method(),
      instance,
    })

    // TODO: Emit a user logged out event for activity logging
    // const userId = auth.user?.id // Capture user ID before logout
    // Events.emit('user::loggedOut', { userId })

    // Log the user out of the session
    await auth.use('web').logout()

    logger.info('User session ended, logged out')

    // Redirect to the homepage or login page
    response.redirect('/')
  }
}
