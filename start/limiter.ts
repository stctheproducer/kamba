/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'

// export const throttle = limiter.define('global', () => {
//   return limiter.allowRequests(1_000).every('1 minute').blockFor('1 minute')
// })

export const throttle = limiter.define('global', (ctx) => {
  /**
   * Allow logged-in users to make 100 requests by
   * their user ID
   */
  if (ctx.auth.user) {
    return limiter
      .allowRequests(10_000)
      .every('1 minute')
      .usingKey(`user_${ctx.auth.user.id}`)
      .blockFor('2 minutes')
  }

  /**
   * Allow guest users to make 10 requests by ip address
   */
  return limiter
    .allowRequests(1_000)
    .every('1 minute')
    .usingKey(`ip_${ctx.request.ip()}`)
    .blockFor('5 minutes')
})
