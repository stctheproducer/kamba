import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UserModel from '#models/user_model'
import { v7 as uuidv7 } from 'uuid'

export default class Model extends BaseModel {
  @beforeCreate()
  static assignUuid(model: Model) {
    if (!model.id) {
      model.id = uuidv7()
    }
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare provider: string

  @column()
  declare modelId: string

  @column()
  declare isActive: boolean

  @column()
  declare config: any

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => UserModel)
  declare userModels: HasMany<typeof UserModel>
}
