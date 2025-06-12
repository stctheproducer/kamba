/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
router.on('/').renderInertia('home')

const AuthController = () => import('#controllers/auth_controller')
router
  .group(() => {
    router
      .get('/logto/redirect', ({ ally }) => {
        return ally.use('logto').redirect()
      })
      .as('logto.redirect')

    router.get('/logto/callback', [AuthController, 'handleCallback']).as('logto.callback')
  })
  .prefix('auth')
  .as('auth')

router
  .group(() => {
    router
      .get('/token', ({ response }) => {
        // return ally.use('logto').getManagementApiToken()
        response.ok('Ubuteko')
      })
      .as('logto.management.token')
  })
  .prefix('ubuteko')
  .as('admin')
