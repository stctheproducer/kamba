import type { HttpContext } from '@adonisjs/core/http'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { tryCatch } from '#utils/try_catch'
import {
  chatIndexValidator,
  // chatMessageSchema
} from '#validators/chat'
// import { errors } from '@vinejs/vine'
import { v7 as uuidv7 } from 'uuid'
// import BadRequestException from '#exceptions/bad_request_exception'
import ServerErrorException from '#exceptions/server_error_exception'
import ProblemException from '#exceptions/problem_exception'
import Message from '#models/message'
import Chat from '#models/chat'
import User from '#models/user'
import app from '@adonisjs/core/services/app'

export default class ChatsController {
  async index({ inertia, request }: HttpContext) {
    const data = await request.validateUsing(chatIndexValidator)
    const id = data.params.id

    return inertia.render('chat/index', {
      id,
    })
  }

  async handleChat({ request, response, logger: parentLogger }: HttpContext) {
    let testUserId: string

    if (app.inDev) {
      const testUser = await User.firstOrFail()
      testUserId = testUser.id
    }

    const instance = request.url()
    const logger = parentLogger.child({
      context: 'ChatsController.handleChat',
      method: request.method(),
      instance,
    })

    // TODO: Re-enable validation after bug is fixed
    // const [data, validationError] = await tryCatch(() => {
    //   return request.validateUsing(chatMessageSchema)
    // })

    // if (validationError instanceof errors.E_VALIDATION_ERROR) {
    //   logger.warn(
    //     { error: validationError.messages, body: request.body() },
    //     'Invalid request body received'
    //   )
    //   throw new BadRequestException('Invalid chat message data', instance, {
    //     errors: validationError.messages,
    //   })
    // }
    const data = request.only(['messages', 'chatId'])

    if (!data) {
      logger.fatal({ body: request.body() }, 'Something went wrong with the validation')
      throw new ServerErrorException('Something went wrong with the validation', instance)
    }

    const incomingMessages = data.messages
    // const chatId = data.headers['X-Chat-Id'] || data.chatId
    const chatId = request.header('X-Chat-Id') || data.chatId
    logger.debug(data, 'Request validated successfully')

    const latestUserMessage = incomingMessages[incomingMessages.length - 1]
    let userMessageRecord: Message | null = null
    let aiMessageRecord: Message | null = null
    let chatRecord: Chat | null = null

    const [newChat, createChatError] = await tryCatch(async () => {
      const chat = new Chat()
      // TODO: Change this to the authenticated user
      chat.userId = testUserId
      chat.title = null // To be replaced by AI generated title
      await chat.save()
      return chat
    })

    if (createChatError) {
      logger.error({ error: createChatError }, 'Failed to create new chat')
      throw new ProblemException(
        'Failed to create chat',
        'chat-create-error',
        'Could not start a new chat session.',
        instance,
        500,
        { dbError: createChatError.message }
      )
    }
    chatRecord = newChat!
    logger.debug({ chatRecord }, 'New chat created (mocked)')

    // Save the user message linked to the new chat
    const [savedUserMessage, saveUserMessageError] = await tryCatch(async () => {
      const message = new Message()
      message.chatId = chatRecord.id
      message.role = 'user'
      message.content = latestUserMessage.content
      await message.save()
      return message
    })

    if (!savedUserMessage && saveUserMessageError) {
      logger.error(
        { error: saveUserMessageError, chatId: chatRecord.id },
        'Failed to save user message'
      )
      // Decide policy: continue with AI interaction despite DB error, or halt?
      // For this mock, we'll log and proceed.
      logger.error(
        { error: saveUserMessageError, chatId: chatRecord.id },
        'Continuing AI interaction despite user message save failure (mock)'
      )
    } else {
      userMessageRecord = savedUserMessage!
      logger.debug(
        { messageId: userMessageRecord.id, chatId: chatRecord.id },
        'User message saved (mocked)'
      )
    }

    // Create a placeholder AI message record *before* streaming
    const [placeholderAIMessage, savePlaceholderError] = await tryCatch(async () => {
      const message = new Message()
      message.id = uuidv7() // Generate UUID
      message.chatId = chatRecord!.id
      message.role = 'assistant' // Assuming assistant response
      message.content = '' // Start empty
      message.parentMessageId = userMessageRecord?.id || null // Link to user message
      message.metadata = {} // Placeholder for tool calls etc.
      await message.save()
      return message
    })

    if (savePlaceholderError) {
      logger.error(
        { error: savePlaceholderError, chatId: chatRecord.id },
        'Failed to save placeholder AI message'
      )
      // This is a critical error. Without a message ID, we can't update the record later.
      // Throw a ProblemException to stop the request and notify the client.
      throw new ProblemException(
        'Database Error',
        'ai-message-placeholder-save-error',
        'Could not save AI message placeholder before streaming.',
        instance,
        500,
        { chatId: chatRecord.id, dbError: savePlaceholderError.message }
      )
    }
    aiMessageRecord = placeholderAIMessage!
    logger.debug(
      { messageId: aiMessageRecord.id, chatId: chatRecord.id },
      'Placeholder AI message saved (mocked)'
    )

    try {
      const aiResponse = streamText({
        model: openai('gpt-3.5-turbo'),
        // @ts-ignore
        messages: incomingMessages,
        onError(error) {
          logger.error(error, 'Error during AI streaming after validation')
        },
        // onChunk: (chunk) => {
        //   logger.debug({ chunk }, 'Received chunk from AI streamText')
        // },
        // onFinish: (result) => {
        //   logger.debug({ result }, 'Received final from AI streamText')
        // },
      })

      logger.debug('Initiated AI streamText call')

      return aiResponse.pipeDataStreamToResponse(response.response)
    } catch (error) {
      logger.error({ error }, 'Error during AI streaming after validation')
      throw new ProblemException(
        'AI Generation Failed',
        'https://httpstatuses.com/500',
        'An error occurred while generating the AI response.',
        instance,
        500,
        {
          error: error.message,
        }
      )
    }
  }
}
