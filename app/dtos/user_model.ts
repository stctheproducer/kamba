import { BaseModelDto } from '@adocasts.com/dto/base'
import UserModel from '#models/user_model'
import ModelDto from '#dtos/model'
import UserDto from '#dtos/user'

export default class UserModelDto extends BaseModelDto {
  declare id: string
  declare userId: string
  declare modelId: string
  declare isDefault: boolean
  declare config: any
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto
  declare model: ModelDto

  constructor(userModel?: UserModel) {
    super()

    if (!userModel) return

    this.id = userModel.id
    this.userId = userModel.userId
    this.modelId = userModel.modelId
    this.isDefault = userModel.isDefault
    this.config = userModel.config
    this.createdAt = userModel.createdAt.toISO()!
    this.updatedAt = userModel.updatedAt.toISO()!
    this.user = new UserDto(userModel.user)
    this.model = new ModelDto(userModel.model)
  }
}
