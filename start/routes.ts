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

router.on('/').renderInertia('home').as('home')

const AuthController = () => import('#controllers/auth_controller')
router
  .group(() => {
    router.on('/login').renderInertia('auth/login').as('login')

    router
      .get('/:provider/redirect', [AuthController, 'login'])
      .where('provider', /logto|github/)
      .as('oauth.redirect')

    router
      .get('/:provider/callback', [AuthController, 'handleCallback'])
      .where('provider', /logto|github/)
      .as('oauth.callback')

    router.post('/logout', [AuthController, 'logout']).as('logout')
  })
  .prefix('auth')
  .as('auth')

const ChatsController = () => import('#controllers/chats_controller')
router
  .group(() => {
    router.get('/', [ChatsController, 'index']).use(middleware.auth()).as('chat')
  })
  .prefix('chat')
  .as('chat')

// API routes for chats and messages
router
  .group(() => {
    // router
    //   .post('/chats', [ChatsController, 'store'])
    //   .use(middleware.auth())
    //   .use(middleware.reportUsage({ event: 'chats.created' }))
    //   .as('chats.store')
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
