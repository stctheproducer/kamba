import ServerErrorException from '#exceptions/server_error_exception'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import User from '#models/user'
import { tryCatch } from '#utils/try_catch'
import type { HttpContext } from '@adonisjs/core/http'
// import { v7 as uuidv7 } from 'uuid'

export default class AuthController {
  async login({ ally, request, inertia, logger: parentLogger }: HttpContext) {
    const logger = parentLogger.child({ context: 'AuthController.login' })
    logger.info('Initiating OAuth login redirect')
    const provider = request.param('provider')

    if (!['logto', 'github'].includes(provider)) {
      logger.warn({ provider }, 'Unsupported OAuth provider requested')
      throw new UnauthorizedException('Unsupported OAuth provider')
    }

    // provider is now safely typed as the allowed union
    const typedProvider = provider as 'logto' | 'github'
    // Redirect user to Logto for authentication
    return inertia.location(await ally.use(typedProvider).getRedirectUrl())
  }

  async handleCallback({ ally, request, inertia, auth, logger: parentLogger }: HttpContext) {
    const instance = request.url()
    const logger = parentLogger.child({
      context: 'AuthController.handleCallback',
      method: request.method(),
      instance,
    })

    logger.debug('Handling OAuth callback')

    const provider = request.param('provider')

    if (!['logto', 'github'].includes(provider)) {
      logger.warn({ provider }, 'Unsupported OAuth provider requested')
      throw new UnauthorizedException('Unsupported OAuth provider')
    }

    // provider is now safely typed as the allowed union
    const typedProvider = provider as 'logto' | 'github'

    const oauth = ally.use(typedProvider)

    // The user has denied access or something went wrong with Logto
    if (oauth.accessDenied()) {
      logger.warn('User denied access during OAuth callback')
      throw new UnauthorizedException('Access denied by user')
    }

    // OAuth returned an error
    if (oauth.hasError()) {
      const error = oauth.getError()
      logger.error({ error }, 'Something went wrong post redirect from OAuth')
      throw new UnauthorizedException('Authentication failed', instance, { error })
    }

    // Use tryCatch for fetching OAuth user details
    const [oauthUser, oauthUserError] = await tryCatch(() => oauth.user())

    if (oauthUserError || !oauthUser) {
      logger.error({ error: oauthUserError }, 'Failed to retrieve OAuth user details')
      throw new UnauthorizedException('Failed to retrieve OAuth user details', instance, {
        error: oauthUserError,
      })
    }

    // Check if email is available in the OAuth user data
    if (!oauthUser.email) {
      logger.error(
        { oauthUserId: oauthUser.id },
        'Email is required but not provided by OAuth provider'
      )
      throw new UnauthorizedException(
        'Email permission is required. Please grant access to your email address to continue.',
        instance
      )
    }

    logger.debug(
      { oauthUserId: oauthUser.id, email: oauthUser.email },
      'Successfully retrieved OAuth user'
    )

    // Find or create the user in our database
    // Using tryCatch for database operation
    const [user, findOrCreateError] = await tryCatch(async () => {
      // Find a user by their Logto ID
      let userRecord = await User.findBy('oauthId', oauthUser.id)

      if (!userRecord) {
        logger.info({ oauthUserId: oauthUser.id }, 'User not found, creating new user')
        // User not found, create a new one
        userRecord = new User()
        // userRecord.id = uuidv7() // Generate UUID for SQLite
        userRecord.oauthId = oauthUser.id
        userRecord.oauthProvider = typedProvider
        userRecord.email = oauthUser.email
        userRecord.username =
          oauthUser.nickName ??
          (oauthUser.email ? oauthUser.email.split('@')[0] : `user_${Date.now()}`)
        // userRecord.isBetaUser = false // Default status
        // userRecord.isPayingUser = false // Default status

        await userRecord.save()
        logger.info({ userId: userRecord.id }, 'New user created successfully')

        // TODO: Emit a user created event for activity logging and other processes
        // Events.emit('user::created', { userId: userRecord.id, logtoUserId: logtoUser.id })
      } else {
        logger.debug({ userId: userRecord.id, logtoUserId: oauthUser.id }, 'Existing user found')
        // TODO: Optionally update user information from Logto if needed
        // e.g., userRecord.username = logtoUser.username || userRecord.username
        // await userRecord.save()
      }

      return userRecord
    })

    // Ideally this shouldn't happen, but it's a good guard to have
    if (!user) {
      logger.error({ oauthUserId: oauthUser.id }, 'Failed to find or create user')
      throw new ServerErrorException('Failed to process user account', instance, {
        error: findOrCreateError,
      })
    }

    if (findOrCreateError) {
      logger.error(
        { error: findOrCreateError, oauthUserId: oauthUser.id },
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
    return inertia.render('chat/index')
  }

  async logout({ auth, inertia, request, logger: parentLogger }: HttpContext) {
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
    return inertia.render('home')
  }
}
