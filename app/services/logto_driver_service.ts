/*
|--------------------------------------------------------------------------
| Ally Oauth driver
|--------------------------------------------------------------------------
|
| Make sure you through the code and comments properly and make necessary
| changes as per the requirements of your implementation.
|
*/

/**
|--------------------------------------------------------------------------
 *  Search keyword "LogtoDriver" and replace it with a meaningful name
|--------------------------------------------------------------------------
 */

import { Oauth2Driver } from '@adonisjs/ally'
import type { HttpContext } from '@adonisjs/core/http'
import type {
  AllyDriverContract,
  AllyUserContract,
  ApiRequestContract,
  LiteralStringUnion,
} from '@adonisjs/ally/types'
import JWKS, { CertSigningKey, JwksClient, RsaSigningKey } from 'jwks-rsa'
import { DateTime } from 'luxon'
import JWT from 'jsonwebtoken'
import stringHelpers from '@adonisjs/core/helpers/string'

/**
 *
 * Access token returned by your driver implementation. An access
 * token must have "token" and "type" properties and you may
 * define additional properties (if needed)
 */
export type LogtoDriverAccessToken = {
  token: string
  type: 'bearer'
}

/**
 * Scopes accepted by the driver implementation.
 */
export type LogtoDriverScopes =
  | 'openid'
  | 'profile'
  | 'offline_access'
  | 'phone'
  | 'email'
  | 'address'
  | 'custom_data'
  | 'identities'
  | 'roles'
  | 'urn:logto:scope:organizations'
  | 'urn:logto:scope:organization_roles'
  | (string & {})

/**
 * The configuration accepted by the driver implementation.
 */
export type LogtoDriverConfig = {
  driver: 'logto'
  clientId: string
  clientSecret: string
  callbackUrl: string
  endpoint: string
  authorizeUrl?: string
  accessTokenUrl?: string
  userInfoUrl?: string
  scopes?: LiteralStringUnion<LogtoDriverScopes> | LogtoDriverScopes[]
}

/**
 * Driver implementation. It is mostly configuration driven except the API call
 * to get user info.
 */
export class LogtoDriver
  extends Oauth2Driver<LogtoDriverAccessToken, LogtoDriverScopes>
  implements AllyDriverContract<LogtoDriverAccessToken, LogtoDriverScopes>
{
  /**
   * The URL for the redirect request. The user will be redirected on this page
   * to authorize the request.
   *
   * Do not define query strings in this URL.
   */
  protected authorizeUrl = '/oidc/auth'

  /**
   * The URL to hit to exchange the authorization code for the access token
   *
   * Do not define query strings in this URL.
   */
  protected accessTokenUrl = '/oidc/token'

  /**
   * The URL to hit to get the user details
   *
   * Do not define query strings in this URL.
   */
  protected userInfoUrl = '/oidc/me'

  /**
   * JWKS Client, it is to validate Logto's access tokens
   */
  protected jwksClient: JwksClient | null = null

  /**
   * The param name for the authorization code. Read the documentation of your oauth
   * provider and update the param name to match the query string field name in
   * which the oauth provider sends the authorization_code post redirect.
   */
  protected codeParamName = 'code'

  /**
   * The param name for the error. Read the documentation of your oauth provider and update
   * the param name to match the query string field name in which the oauth provider sends
   * the error post redirect
   */
  protected errorParamName = 'error'

  /**
   * Cookie name for storing the CSRF token. Make sure it is always unique. So a better
   * approach is to prefix the oauth provider name to `oauth_state` value. For example:
   * For example: "facebook_oauth_state"
   */
  protected stateCookieName = 'logto_oauth_state'

  /**
   * Parameter name to be used for sending and receiving the state from.
   * Read the documentation of your oauth provider and update the param
   * name to match the query string used by the provider for exchanging
   * the state.
   */
  protected stateParamName = 'state'

  /**
   * Parameter name for sending the scopes to the oauth provider.
   */
  protected scopeParamName = 'scope'

  /**
   * The separator indentifier for defining multiple scopes
   */
  protected scopesSeparator = ' '

  constructor(
    ctx: HttpContext,
    public config: LogtoDriverConfig
  ) {
    super(ctx, config)

    this.authorizeUrl = this.config.authorizeUrl || this.config.endpoint.concat(this.authorizeUrl)
    this.accessTokenUrl =
      this.config.accessTokenUrl || this.config.endpoint.concat(this.accessTokenUrl)
    this.userInfoUrl = this.config.userInfoUrl || this.config.endpoint.concat(this.userInfoUrl)

    /**
     * Initiate JWKS client
     */
    this.jwksClient = JWKS({
      rateLimit: true,
      cache: true,
      cacheMaxEntries: 100,
      cacheMaxAge: stringHelpers.milliseconds.parse('1d'),
      jwksUri: this.config.endpoint.concat('/oidc/jwks'),
    })

    /**
     * Extremely important to call the following method to clear the
     * state set by the redirect request.
     *
     * DO NOT REMOVE THE FOLLOWING LINE
     */
    this.loadState()
  }

  /**
   * Optionally configure the authorization redirect request. The actual request
   * is made by the base implementation of "Oauth2" driver and this is a
   * hook to pre-configure the request.
   */
  // protected configureRedirectRequest(request: RedirectRequest<LogtoDriverScopes>) {}

  /**
   * Optionally configure the access token request. The actual request is made by
   * the base implementation of "Oauth2" driver and this is a hook to pre-configure
   * the request
   */
  // protected configureAccessTokenRequest(request: ApiRequest) {}

  /**
   * Update the implementation to tell if the error received during redirect
   * means "ACCESS DENIED".
   */
  accessDenied() {
    return this.ctx.request.input('error') === 'user_denied'
  }

  /**
   * Get the user details by query the provider API. This method must return
   * the access token and the user details both. Checkout the google
   * implementation for same.
   *
   * https://github.com/adonisjs/ally/blob/develop/src/Drivers/Google/index.ts#L191-L199
   */
  async user(
    callback?: (request: ApiRequestContract) => void
  ): Promise<AllyUserContract<LogtoDriverAccessToken>> {
    const accessToken = await this.accessToken()
    const request = this.httpClient(this.config.userInfoUrl || this.userInfoUrl)

    /**
     * Allow end user to configure the request. This should be called after your custom
     * configuration, so that the user can override them (if needed)
     */
    if (typeof callback === 'function') {
      callback(request)
    }

    /**
     * Write your implementation details here.
     */
  }

  async userFromToken(
    accessToken: string,
    callback?: (request: ApiRequestContract) => void
  ): Promise<AllyUserContract<{ token: string; type: 'bearer' }>> {
    const request = this.httpClient(this.config.userInfoUrl || this.userInfoUrl)

    /**
     * Allow end user to configure the request. This should be called after your custom
     * configuration, so that the user can override them (if needed)
     */
    if (typeof callback === 'function') {
      callback(request)
    }

    /**
     * Write your implementation details here
     */
  }
}

/**
 * The factory function to reference the driver implementation
 * inside the "config/ally.ts" file.
 */
export function LogtoDriverService(config: LogtoDriverConfig): (ctx: HttpContext) => LogtoDriver {
  return (ctx) => new LogtoDriver(ctx, config)
}
