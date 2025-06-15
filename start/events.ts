import emitter from '@adonisjs/core/services/emitter'
import UserRegistered from '#events/user/user_registered'
import UserLoggedIn from '#events/user/user_logged_in'
import UserLoggedOut from '#events/user/user_logged_out'

emitter.listen(UserRegistered, [() => import('#listeners/user_events')])
emitter.listen(UserLoggedIn, [() => import('#listeners/user_events')])
emitter.listen(UserLoggedOut, [() => import('#listeners/user_events')])
