import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Model from '#models/model'
import { v7 as uuidv7 } from 'uuid'

export default class UserModel extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignUuid(userModel: UserModel) {
    if (!userModel.id) {
      userModel.id = uuidv7()
    }
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare modelId: string

  @column()
  declare isDefault: boolean

  @column()
  declare config: any

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Model)
  declare model: BelongsTo<typeof Model>
}
