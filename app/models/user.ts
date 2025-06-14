import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Chat from '#models/chat'
import UserModel from '#models/user_model'
import { v7 as uuidv7 } from 'uuid'
import Subscription from '#models/subscription'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'username'],
  passwordColumnName: 'password',
})

// Note: Regular users will not have a local password as they authenticate via Logto.
// This model structure is flexible, but the password column will be null for Logto users.
export default class User extends compose(BaseModel, AuthFinder) {
  static selfAssignPrimaryKey = true
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  // Add a beforeCreate hook to generate UUIDs for SQLite
  @beforeCreate()
  static assignUuid(user: User) {
    if (!user.id) {
      user.id = uuidv7()
    }
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column()
  declare firstName: string | null

  @column()
  declare middleName: string | null

  @column()
  declare lastName: string | null

  @column({ serializeAs: null })
  declare password?: string

  @column()
  declare logtoId: string

  @column()
  declare username: string | null

  @column()
  declare isBetaUser: boolean

  @column()
  declare isPayingUser: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Chat)
  declare chats: HasMany<typeof Chat>

  @hasMany(() => UserModel)
  declare userModels: HasMany<typeof UserModel>

  @hasMany(() => Subscription)
  declare subscriptions: HasMany<typeof Subscription>
}
