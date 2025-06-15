import { BaseModelDto } from '@adocasts.com/dto/base'
import Chat from '#models/chat'
import UserDto from '#dtos/user'
import MessageDto from '#dtos/message'

export default class ChatDto extends BaseModelDto {
  declare id: string
  declare userId: string
  declare title: string | null
  declare createdAt: string
  declare updatedAt: string
  declare deletedAt: string | null
  declare user: UserDto | null
  declare messages: MessageDto[]

  constructor(chat?: Chat) {
    super()

    if (!chat) return
    this.id = chat.id
    this.userId = chat.userId
    this.title = chat.title
    this.createdAt = chat.createdAt.toISO()!
    this.updatedAt = chat.updatedAt.toISO()!
    this.deletedAt = chat.deletedAt?.toISO()!
    this.user = chat.user && new UserDto(chat.user)
    this.messages = MessageDto.fromArray(chat.messages)
  }
}