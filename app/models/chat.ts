// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Message from '#models/message'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { v7 as uuidv7 } from 'uuid'

export default class Chat extends compose(BaseModel, SoftDeletes) {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignUuid(chat: Chat) {
    if (!chat.id) {
      chat.id = uuidv7()
    }
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare title: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>
}
