import Model from '#models/model'
import { BaseDto } from '@adocasts.com/dto/base'

export default class ModelDto extends BaseDto {
  declare id: string
  declare name: string
  declare provider: string
  declare modelId: string
  declare isActive: boolean
  declare config: any
  declare createdAt: string
  declare updatedAt: string

  constructor(model?: Model) {
    super()

    if (!model) return

    this.id = model.id
    this.name = model.name
    this.provider = model.provider
    this.modelId = model.modelId
    this.isActive = model.isActive
    this.config = model.config
    this.createdAt = model.createdAt.toISO()!
    this.updatedAt = model.updatedAt.toISO()!
  }
}
