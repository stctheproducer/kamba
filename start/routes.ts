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
    router.get('/login', ({ inertia }) => inertia.render('auth/login')).as('login')

    router.get('/logto/redirect', [AuthController, 'login']).as('logto.redirect')

    router.get('/logto/callback', [AuthController, 'handleCallback']).as('logto.callback')

    router.post('/logout', [AuthController, 'logout']).as('logout')
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
