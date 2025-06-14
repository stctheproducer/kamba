import type { HttpContext } from '@adonisjs/core/http'

export default class ChatsController {
  async index({ inertia }: HttpContext) {
    inertia.render('chat/index')
  }
}
