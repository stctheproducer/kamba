import { BaseModelDto } from '@adocasts.com/dto/base'
import Subscription from '#models/subscription'
import UserDto from '#dtos/user'

export default class SubscriptionDto extends BaseModelDto {
  declare id: string
  declare userId: string
  declare planId: string
  declare status: string
  declare currentPeriodStart: string
  declare currentPeriodEnd: string
  declare cancelAtPeriodEnd: boolean
  declare cancelAt: string | null
  declare canceledAt: string | null
  declare endedAt: string | null
  declare trialStart: string | null
  declare trialEnd: string | null
  declare metadata: any | null
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null

  constructor(subscription?: Subscription) {
    super()

    if (!subscription) return
    this.id = subscription.id
    this.userId = subscription.userId
    this.planId = subscription.planId
    this.status = subscription.status
    this.currentPeriodStart = subscription.currentPeriodStart.toISO()!
    this.currentPeriodEnd = subscription.currentPeriodEnd.toISO()!
    this.cancelAtPeriodEnd = subscription.cancelAtPeriodEnd
    this.cancelAt = subscription.cancelAt?.toISO()!
    this.canceledAt = subscription.canceledAt?.toISO()!
    this.endedAt = subscription.endedAt?.toISO()!
    this.trialStart = subscription.trialStart?.toISO()!
    this.trialEnd = subscription.trialEnd?.toISO()!
    this.metadata = subscription.metadata
    this.createdAt = subscription.createdAt.toISO()!
    this.updatedAt = subscription.updatedAt.toISO()!
    this.user = subscription.user && new UserDto(subscription.user)
  }
}
