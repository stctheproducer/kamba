import User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class UserLoggedIn extends BaseEvent {
  static name = 'user::loggedIn'

  /**
   * Accept event data as constructor parameters
   */
  constructor(public user: User) {
    super()
  }
}
