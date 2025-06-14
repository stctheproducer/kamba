import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { v7 as uuidv7 } from 'uuid'

export default class Payment extends BaseModel {
  @beforeCreate()
  static assignUuid(payment: Payment) {
    if (!payment.id) {
      payment.id = uuidv7()
    }
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare amount: number

  @column()
  declare currency: string

  @column()
  declare status: string

  @column()
  declare paymentMethod: string

  @column()
  declare paymentIntentId: string

  @column()
  declare receiptUrl: string | null

  @column()
  declare metadata: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
