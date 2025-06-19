// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import type { HttpContext } from '@adonisjs/core/http'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { tryCatch } from '#utils/try_catch'
import { chatIndexValidator, chatMessageSchema } from '#validators/chat'
import { errors } from '@vinejs/vine'
// import { v7 as uuidv7 } from 'uuid'
import BadRequestException from '#exceptions/bad_request_exception'
import ServerErrorException from '#exceptions/server_error_exception'
import ProblemException from '#exceptions/problem_exception'
import Message from '#models/message'
import Chat from '#models/chat'
import User from '#models/user'
import app from '@adonisjs/core/services/app'
import { Exception } from '@adonisjs/core/exceptions'

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
    const [data, validationError] = await tryCatch(() => request.validateUsing(chatMessageSchema))

    if (validationError) {
      if (validationError instanceof errors.E_VALIDATION_ERROR) {
        const error = new BadRequestException('Invalid chat message data', instance, {
          errors: validationError.messages,
        })
        logger.error(error, 'Invalid chat message data')
        return `${error.title}: ${error.detail}`
      }
      const error = new ServerErrorException('Something went wrong with the validation', instance)
      logger.error(error, 'Something went wrong with the validation')
      return `${error.title}: ${error.detail}`
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
      if (!chatId) {
        const chat = new Chat()
        // TODO: Change this to the authenticated user
        chat.userId = testUserId
        chat.title = null // To be replaced by AI generated title
        await chat.save()
        return chat
      }
      return await Chat.findOrFail(chatId)
    })

    if (createChatError) {
      const error = new ProblemException(
        'Failed to create chat',
        'chat-create-error',
        'Could not start a new chat session.',
        instance,
        500,
        { dbError: createChatError.message }
      )
      logger.error(error, 'Failed to create new chat')
      return `${error.title}: ${error.detail}`
    }
    chatRecord = newChat
    logger.debug({ chatRecord }, 'New chat created (mocked)')

    // Save the user message linked to the new chat
    const [savedUserMessage, saveUserMessageError] = await tryCatch(async () => {
      const message = new Message()
      message.chatId = chatRecord.id
      message.role = 'user'
      message.model = data.model
      if (typeof latestUserMessage.content === 'string') {
        message.text = latestUserMessage.content
      } else {
        const lastContent = latestUserMessage.content[latestUserMessage.content.length - 1]
        if (lastContent.type === 'text') {
          message.text = lastContent.text
        }
      }
      message.content = JSON.stringify(latestUserMessage.content)
      await message.save()
      return message
    })

    if (saveUserMessageError) {
      const error = new ProblemException(
        'Failed to save user message',
        'user-message-save-error',
        'Could not save user message.',
        instance,
        500,
        { dbError: saveUserMessageError.message }
      )
      // Decide policy: continue with AI interaction despite DB error, or halt?
      // For this mock, we'll log and proceed.
      logger.error(error, 'Continuing AI interaction despite user message save failure (mock)')
    } else {
      userMessageRecord = savedUserMessage
      logger.debug(
        { messageId: userMessageRecord.id, chatId: chatRecord.id },
        'User message saved (mocked)'
      )
    }

    // Create a placeholder AI message record *before* streaming
    const [placeholderAIMessage, savePlaceholderError] = await tryCatch(async () => {
      const message = new Message()
      message.chatId = chatRecord.id
      message.role = 'assistant' // Assuming assistant response
      message.model = data.model
      message.text = ''
      message.content = JSON.stringify([]) // Start empty
      message.parentMessageId = userMessageRecord?.id || null // Link to user message
      message.metadata = JSON.stringify({}) // Placeholder for tool calls etc.
      await message.save()
      return message
    })

    if (savePlaceholderError) {
      const error = new ProblemException(
        'Database Error',
        'ai-message-placeholder-save-error',
        'Could not save AI message placeholder before streaming.',
        instance,
        500,
        { chatId: chatRecord.id, dbError: savePlaceholderError.message }
      )
      logger.error(error, 'Error saving placeholder AI message')
      return `${error.title}: ${error.detail}`
    }
    aiMessageRecord = placeholderAIMessage

    response.response.setHeader('X-Chat-Id', chatRecord.id)
    try {
      const aiResponse = streamText({
        model: openai(data.model),
        // @ts-ignore
        messages: incomingMessages,
        // onError(error) {
        //   logger.error(error, 'Error during AI streaming after validation')
        // },
        // onChunk: (chunk) => {
        //   logger.debug({ chunk }, 'Received chunk from AI streamText')
        // },
        onFinish: async (result) => {
          const latestMessage = result.response.messages[result.response.messages.length - 1]
          if (typeof latestMessage.content === 'string') {
            aiMessageRecord.text = latestMessage.content
          } else {
            const lastContent = latestMessage.content[latestMessage.content.length - 1]
            switch (lastContent.type) {
              case 'text':
                aiMessageRecord.text = lastContent.text
                break
              case 'file':
                aiMessageRecord.text = lastContent.data.toString()
                break
              case 'reasoning':
                aiMessageRecord.text = lastContent.text
                break
              case 'redacted-reasoning':
                aiMessageRecord.text = lastContent.data
                break
              case 'tool-call':
                aiMessageRecord.text = lastContent.toolCallId
                break
              case 'tool-result':
                aiMessageRecord.text = lastContent.toolCallId
                break
            }
          }
          aiMessageRecord.content = JSON.stringify(latestMessage.content)
          aiMessageRecord.responseId = latestMessage.id
          aiMessageRecord.metadata = JSON.stringify({
            finishReason: result.finishReason,
            usage: result.usage,
            id: result.response.id,
            modelId: result.response.modelId,
            providerMetadata: result.providerMetadata,
          })
          aiMessageRecord.promptTokens = result.usage.promptTokens
          aiMessageRecord.completionTokens = result.usage.completionTokens
          aiMessageRecord.totalTokens = result.usage.totalTokens
          await aiMessageRecord.save()
        },
      })

      logger.debug('Initiated AI streamText call')

      return aiResponse.pipeDataStreamToResponse(response.response, {
        sendReasoning: true,
        getErrorMessage(error: unknown) {
          if (typeof error === 'string') {
            logger.debug('Returning error to UI')
            return error
          } else if (error instanceof Error) {
            return error.message
          } else if (error instanceof ProblemException) {
            return error.detail || error.message || error.title
          } else if (error instanceof Exception) {
            return error.message
          }

          return JSON.stringify(error)
        },
      })
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
