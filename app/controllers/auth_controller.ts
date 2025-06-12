import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ ally }: HttpContext) {
    // Redirect user to Logto for authentication
    return ally.use('logto').redirect()
  }
}
