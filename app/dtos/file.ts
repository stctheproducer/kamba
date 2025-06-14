import { BaseModelDto } from '@adocasts.com/dto/base'
import File from '#models/file'

export default class FileDto extends BaseModelDto {
  declare id: string
  declare createdAt: string
  declare updatedAt: string

  constructor(file?: File) {
    super()

    if (!file) return
    this.id = file.id
    this.createdAt = file.createdAt.toISO()!
    this.updatedAt = file.updatedAt.toISO()!
  }
}