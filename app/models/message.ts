// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
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
  declare responseId: string | null

  @column()
  declare parentMessageId: string | null

  @column()
  declare role: 'system' | 'user' | 'assistant' | 'tool'

  @column()
  declare text: string

  @column()
  declare model: string

  @column()
  declare promptTokens: number | null

  @column()
  declare completionTokens: number | null

  @column()
  declare totalTokens: number | null

  @column()
  declare content: any

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
