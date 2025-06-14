import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { v7 as uuidv7 } from 'uuid'

export default class Subscription extends BaseModel {
  @beforeCreate()
  static assignUuid(subscription: Subscription) {
    if (!subscription.id) {
      subscription.id = uuidv7()
    }
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare planId: string

  @column()
  declare status:
    | 'active'
    | 'canceled'
    | 'past_due'
    | 'unpaid'
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'paused'

  @column()
  declare currentPeriodStart: DateTime

  @column()
  declare currentPeriodEnd: DateTime

  @column()
  declare cancelAtPeriodEnd: boolean

  @column()
  declare cancelAt: DateTime | null

  @column()
  declare canceledAt: DateTime | null

  @column()
  declare endedAt: DateTime | null

  @column()
  declare trialStart: DateTime | null

  @column()
  declare trialEnd: DateTime | null

  @column()
  declare metadata: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
