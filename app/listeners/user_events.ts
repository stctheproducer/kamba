// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import UserRegistered from '#events/user/user_registered'
import UserLoggedIn from '#events/user/user_logged_in'
import UserLoggedOut from '#events/user/user_logged_out'
import logger from '@adonisjs/core/services/logger'

export default class UserEvents {
  /**
   * Define the events this listener is interested in.
   */
  static listensFor = [UserRegistered.name, UserLoggedIn.name, UserLoggedOut.name]

  /**
   * Handle the event.
   */
  async handle(event: UserRegistered | UserLoggedIn | UserLoggedOut) {
    switch (event.constructor.name) {
      case UserRegistered.name:
        // Use the activity logger to log the event, potentially retrieving context from AsyncLocalStorage
        logger.info('User registered:', event.user.id)
        break
      case UserLoggedIn.name:
        // Use the activity logger to log the event, potentially retrieving context from AsyncLocalStorage
        logger.info('User logged in:', event.user.id)
        break
      case UserLoggedOut.name:
        // Use the activity logger to log the event, potentially retrieving context from AsyncLocalStorage
        logger.info('User logged out:', event.user.id)
        break
    }
  }
}
