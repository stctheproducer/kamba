import { BaseModelDto } from '@adocasts.com/dto/base'
import Payment from '#models/payment'
import UserDto from '#dtos/user'

export default class PaymentDto extends BaseModelDto {
  declare id: string
  declare userId: string
  declare amount: number
  declare currency: string
  declare status: string
  declare paymentMethod: string
  declare paymentIntentId: string
  declare receiptUrl: string | null
  declare metadata: any | null
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null

  constructor(payment?: Payment) {
    super()

    if (!payment) return
    this.id = payment.id
    this.userId = payment.userId
    this.amount = payment.amount
    this.currency = payment.currency
    this.status = payment.status
    this.paymentMethod = payment.paymentMethod
    this.paymentIntentId = payment.paymentIntentId
    this.receiptUrl = payment.receiptUrl
    this.metadata = payment.metadata
    this.createdAt = payment.createdAt.toISO()!
    this.updatedAt = payment.updatedAt.toISO()!
    this.user = payment.user && new UserDto(payment.user)
  }
}