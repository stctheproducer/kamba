import User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class UserLoggedOut extends BaseEvent {
  static name = 'user::loggedOut'

  /**
   * Accept event data as constructor parameters
   */
  constructor(public user: User) {
    super()
  }
}
