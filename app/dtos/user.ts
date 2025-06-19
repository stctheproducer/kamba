// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#models/user'
import ChatDto from '#dtos/chat'
import UserModelDto from '#dtos/user_model'
import SubscriptionDto from '#dtos/subscription'

export default class UserDto extends BaseModelDto {
  declare id: string
  declare email: string
  declare firstName: string | null
  declare middleName: string | null
  declare lastName: string | null
  declare password?: string
  declare logtoId: string
  declare username: string | null
  declare isBetaUser: boolean
  declare isPayingUser: boolean
  declare createdAt: string
  declare updatedAt: string
  declare chats: ChatDto[]
  declare userModels: UserModelDto[]
  declare subscriptions: SubscriptionDto[]

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.email = user.email
    this.firstName = user.firstName
    this.middleName = user.middleName
    this.lastName = user.lastName
    this.password = user.password
    this.logtoId = user.oauthId
    this.username = user.username
    this.isBetaUser = user.isBetaUser
    this.isPayingUser = user.isPayingUser
    this.createdAt = user.createdAt.toISO()!
    this.updatedAt = user.updatedAt.toISO()!
    this.chats = ChatDto.fromArray(user.chats)
    this.userModels = UserModelDto.fromArray(user.userModels)
    this.subscriptions = SubscriptionDto.fromArray(user.subscriptions)
  }
}
