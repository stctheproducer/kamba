import User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class UserRegistered extends BaseEvent {
  static name = 'user::registered'

  /**
   * Accept event data as constructor parameters
   */
  constructor(public user: User) {
    super()
  }
}
