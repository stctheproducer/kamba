import { BaseModelDto } from '@adocasts.com/dto/base'
import Message from '#models/message'
import ChatDto from '#dtos/chat'

export default class MessageDto extends BaseModelDto {
  declare id: string
  declare chatId: string
  declare parentMessageId: string | null
  declare role: 'system' | 'user' | 'assistant' | 'tool'
  declare content: any
  declare metadata: any | null
  declare createdAt: string
  declare updatedAt: string
  declare deletedAt: string | null
  declare chat: ChatDto | null
  declare parentMessage: MessageDto | null
  declare childMessages: MessageDto[]

  constructor(message?: Message) {
    super()

    if (!message) return
    this.id = message.id
    this.chatId = message.chatId
    this.parentMessageId = message.parentMessageId
    this.role = message.role
    this.content = message.content
    this.metadata = message.metadata
    this.createdAt = message.createdAt.toISO()!
    this.updatedAt = message.updatedAt.toISO()!
    this.deletedAt = message.deletedAt?.toISO() ?? null
    this.chat = message.chat && new ChatDto(message.chat)
    this.parentMessage = message.parentMessage && new MessageDto(message.parentMessage)
    this.childMessages = MessageDto.fromArray(message.childMessages)
  }
}
