/*
|--------------------------------------------------------------------------
| Ally Oauth driver
|--------------------------------------------------------------------------
|
| Make sure you through the code and comments properly and make necessary
| changes as per the requirements of your implementation.
|
*/

import { Oauth2Driver, RedirectRequest } from '@adonisjs/ally'
import type { HttpContext } from '@adonisjs/core/http'
import type {
  AllyDriverContract,
  AllyUserContract,
  ApiRequestContract,
  LiteralStringUnion,
  Oauth2DriverConfig,
} from '@adonisjs/ally/types'

/**
 *
 * Access token returned by your driver implementation. An access
 * token must have "token" and "type" properties and you may
 * define additional properties (if needed)
 */
export type LogtoAccessToken = {
  token: string
  type: 'bearer'
  expiresIn: number
  expiresAt: Date
  id_token: string
  scope: string
}

/**
 * Scopes accepted by the driver implementation.
 */
export type LogtoScopes =
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
  | 'all' // For management API
  | (string & {})

export interface LogtoDriverContract extends AllyDriverContract<LogtoAccessToken, LogtoScopes> {
  version: 'oauth2'
}

/**
 * The configuration accepted by the driver implementation.
 */
export type LogtoDriverConfig = Oauth2DriverConfig & {
  endpoint: string
  userInfoUrl?: string
  scopes?: LiteralStringUnion<LogtoScopes>[]
}

/**
 * Driver implementation. It is mostly configuration driven except the API call
 * to get user info.
 */
export class LogtoDriver
  extends Oauth2Driver<LogtoAccessToken, LogtoScopes>
  implements AllyDriverContract<LogtoAccessToken, LogtoScopes>
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
  protected configureRedirectRequest(request: RedirectRequest<LogtoScopes>) {
    /**
     * Define user defined scopes or the default ones
     */
    request.scopes(
      this.config.scopes || ['openid', 'profile', 'phone', 'email', 'custom_data', 'offline_access']
    )

    // Add response_type as 'code' which is required for authorization code flow
    request.param('response_type', 'code')
  }

  /**
   * Optionally configure the access token request. The actual request is made by
   * the base implementation of "Oauth2" driver and this is a hook to pre-configure
   * the request
   */
  protected configureAccessTokenRequest(request: ApiRequestContract) {
    // Set the grant_type for token exchange
    request.field('grant_type', 'authorization_code')

    // Add client_id and client_secret for authentication
    request.field('client_id', this.config.clientId)
    request.field('client_secret', this.config.clientSecret)

    // Specify the redirect_uri - must match the one used in the authorization request
    request.field('redirect_uri', this.config.callbackUrl)
  }

  /**
   * Returns the HTTP request with the authorization header set
   */
  protected getAuthenticatedRequest(url: string, token: string) {
    const request = this.httpClient(url)
    request.header('Authorization', `Bearer ${token} `)
    request.header('Accept', 'application/json')
    request.parseAs('json')
    return request
  }

  /**
   * Fetches the user info from the Twitch API
   */
  protected async getUserInfo(token: string, callback?: (request: ApiRequestContract) => void) {
    const logger = this.ctx.logger.child({ context: 'LogtoDriver.user' })

    const request = this.getAuthenticatedRequest(this.userInfoUrl, token)
    logger.debug('Retrieved authenticated request')

    /**
     * Allow end user to configure the request. This should be called after your custom
     * configuration, so that the user can override them (if needed)
     */
    if (typeof callback === 'function') {
      callback(request)
    }

    // Make the request to get user information
    const body = await request.get()
    logger.debug(body, 'Response body')

    return {
      id: body.sub,
      nickName: body.name,
      name: body.name,
      email: body.email,
      emailVerificationState: body.email_verified ? ('verified' as const) : ('unverified' as const),
      avatarUrl: body.picture,
      original: body,
    }
  }

  /**
   * Update the implementation to tell if the error received during redirect
   * means "ACCESS DENIED".
   */
  accessDenied(): boolean {
    const error = this.getError()
    if (!error) return false
    // Logto typically returns 'access_denied' or 'unauthorized' for access denied errors
    return error === 'access_denied' || error === 'unauthorized'
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
  ): Promise<AllyUserContract<LogtoAccessToken>> {
    const accessToken = await this.accessToken(callback)
    const user = await this.getUserInfo(accessToken.token, callback)

    return {
      ...user,
      token: accessToken,
    }
  }

  async userFromToken(
    accessToken: string,
    callback?: (request: ApiRequestContract) => void
  ): Promise<AllyUserContract<Pick<LogtoAccessToken, 'token' | 'type'>>> {
    const user = await this.getUserInfo(accessToken, callback)

    return {
      ...user,
      token: { token: accessToken, type: 'bearer' as const },
    }
  }

  /**
   * Get a token for management API access
   */
  // async getManagementApiToken(): Promise<LogtoAccessToken> {
  //   const request = this.httpClient(this.accessTokenUrl)

  //   // Set up the request for client credentials flow
  //   request.header('Content-Type', 'application/x-www-form-urlencoded')
  //   request.field('grant_type', 'client_credentials')
  //   request.field('client_id', this.config.clientId)
  //   request.field('client_secret', this.config.clientSecret)
  //   request.field('resource', `${this.config.endpoint}/api`)
  //   request.field('scope', 'all')

  //   const body = await request.post()

  //   return {
  //     token: body.access_token,
  //     type: 'bearer' as const,
  //     expiresIn: body.expires_in,
  //   }
  // }
}

/**
 * The factory function to reference the Logto driver implementation
 *
 */
export function logto(config: LogtoDriverConfig): (ctx: HttpContext) => LogtoDriver {
  return (ctx) => new LogtoDriver(ctx, config)
}
