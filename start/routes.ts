/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { throttle } from './limiter.js'
import { middleware } from './kernel.js'

transmit.registerRoutes((route) => {
  // Ensure you are authenticated to register your client
  if (route.getPattern() === '__transmit/events') {
    route.middleware(middleware.auth())
    return
  }

  // Add a throttle middleware to other transmit routes
  route.use(throttle)
})

// router.on('/').renderInertia('home').as('home')
router.on('/').renderInertia('auth/login').as('home.redirect').use(middleware.guest())

const AuthController = () => import('#controllers/auth_controller')
router
  .group(() => {
    router.on('/login').renderInertia('auth/login').as('login').use(middleware.guest())

    router
      .get('/:provider/redirect', [AuthController, 'login'])
      .where('provider', /logto|github/)
      .as('oauth.redirect')
      .use(middleware.guest())

    router
      .get('/:provider/callback', [AuthController, 'handleCallback'])
      .where('provider', /logto|github/)
      .as('oauth.callback')
      .use(middleware.guest())

    router.post('/logout', [AuthController, 'logout']).as('logout')
  })
  .prefix('auth')
  .as('auth')

const PreferencesController = () => import('#controllers/preferences_controller')
router
  .group(() => {
    router
      .put('preferences/:preferenceId', [PreferencesController, 'update'])
      .where('preferenceId', /sidebar-collapsed/)
      .as('preferences.update')
  })
  .prefix('api')
  .as('api')

const ChatsController = () => import('#controllers/chats_controller')
// UI routes for chats and messages
router
  .group(() => {
    router.get('/:id?', [ChatsController, 'index']).as('chat')
  })
  .use(middleware.auth())
  .prefix('chat')
  .as('chat')

// API routes for chats and messages
router
  .group(() => {
    router
      .post('/chat', [ChatsController, 'handleChat'])
      // .use(middleware.auth())
      // .use(middleware.reportUsage({ event: 'chats.created' }))
      .as('chat.send')
    // router
    //   .post('/chats/:id/messages', [ChatsController, 'storeMessage'])
    //   .use(middleware.auth())
    //   .use(middleware.reportUsage({ event: 'messages.created' }))
    //   .as('chats.messages.store')
  })
  .prefix('api')
  .as('api')

router
  .group(() => {
    router
      .get('/token', ({ response }) => {
        // return ally.use('logto').getManagementApiToken()
        return response.ok('Ubuteko')
      })
      .as('logto.management.token')
  })
  .prefix('ubuteko')
  .as('admin')
