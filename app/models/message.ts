import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Chat from '#models/chat'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { v7 as uuidv7 } from 'uuid'

export default class Message extends compose(BaseModel, SoftDeletes) {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignUuid(message: Message) {
    if (!message.id) {
      message.id = uuidv7()
    }
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare chatId: string

  @column()
  declare parentMessageId: string | null

  @column()
  declare role: 'system' | 'user' | 'assistant' | 'tool'

  @column()
  declare content: string

  @column()
  declare metadata: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Chat)
  declare chat: BelongsTo<typeof Chat>

  @belongsTo(() => Message, {
    foreignKey: 'parentMessageId',
  })
  declare parentMessage: BelongsTo<typeof Message>

  @hasMany(() => Message, {
    foreignKey: 'parentMessageId',
  })
  declare childMessages: HasMany<typeof Message>
}
