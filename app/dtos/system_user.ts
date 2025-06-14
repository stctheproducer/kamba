import { BaseModelDto } from '@adocasts.com/dto/base'
import SystemUser from '#models/system_user'

export default class SystemUserDto extends BaseModelDto {
  declare id: string
  declare email: string
  declare password: string
  declare firstName: string | null
  declare middleName: string | null
  declare lastName: string | null
  declare role: string
  declare createdAt: string
  declare updatedAt: string

  constructor(systemUser?: SystemUser) {
    super()

    if (!systemUser) return
    this.id = systemUser.id
    this.email = systemUser.email
    this.password = systemUser.password
    this.firstName = systemUser.firstName
    this.middleName = systemUser.middleName
    this.lastName = systemUser.lastName
    this.role = systemUser.role
    this.createdAt = systemUser.createdAt.toISO()!
    this.updatedAt = systemUser.updatedAt.toISO()!
  }
}