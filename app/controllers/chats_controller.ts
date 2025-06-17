import type { HttpContext } from '@adonisjs/core/http'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export default class ChatsController {
  async index({ inertia }: HttpContext) {
    return inertia.render('chat/index')
  }

  async store({ request, logger: parentLogger }: HttpContext) {
    const instance = request.url()
    const logger = parentLogger.child({
      context: 'ChatsController.store',
      method: request.method(),
      instance,
    })

    logger.debug('Creating new chat')
    // TODO: Add validation of messages with Adonis built-in validator
    const { messages } = await request.only(['messages'])
    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
    })
    return result.toDataStreamResponse()
  }
}
