import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { v7 as uuidv7 } from 'uuid'

export default class File extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignUuid(file: File) {
    if (!file.id) {
      file.id = uuidv7()
    }
  }

  @column({ isPrimary: true })
  declare id: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
