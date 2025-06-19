// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

function hasField(field: string, value: unknown, type: string) {
  return vine.helpers.isObject(value) && value[field] === type
}

function isArrayOfType(value: unknown, type: string): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => vine.helpers.isObject(item) && item.type === type)
  )
}

export const chatIndexValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().uuid().optional(),
    }),
  })
)

const textPartSchema = vine.object({
  type: vine.literal('text'),
  text: vine.string().minLength(1),
  providerOptions: vine.any().optional(),
})

const imagePartSchema = vine.object({
  type: vine.literal('image'),
  image: vine.string().url(),
  mimeType: vine.string().optional(),
  providerOptions: vine.any().optional(),
})

const filePartSchema = vine.object({
  type: vine.literal('file'),
  data: vine.string().url(),
  mimeType: vine.string().minLength(1),
  filename: vine.string().optional(),
  providerOptions: vine.any().optional(),
})

const reasoningPartSchema = vine.object({
  type: vine.literal('reasoning'),
  text: vine.string().minLength(1),
  signature: vine.string().optional(),
  providerOptions: vine.any().optional(),
})

const redactedReasoningPartSchema = vine.object({
  type: vine.literal('redacted-reasoning'),
  data: vine.string().minLength(1),
  providerOptions: vine.any().optional(),
})

const toolCallPartSchema = vine.object({
  type: vine.literal('tool-call'),
  toolCallId: vine.string().minLength(1),
  toolName: vine.string().minLength(1),
  args: vine.any().optional(),
  providerOptions: vine.any().optional(),
})

const toolResultPartSchema = vine.object({
  type: vine.literal('tool-result'),
  toolCallId: vine.string().minLength(1),
  toolName: vine.string().minLength(1),
  result: vine.any().optional(),
  isError: vine.boolean().optional(),
  providerOptions: vine.any().optional(),
})

const systemMessageSchema = vine.object({
  id: vine.string().optional(),
  role: vine.literal('system'),
  content: vine.string().minLength(1),
  providerOptions: vine.any().optional(),
})

const userContent = vine.union([
  // Handle array of objects with type property
  vine.union.if((value) => isArrayOfType(value, 'text'), vine.array(textPartSchema).minLength(1)),
  vine.union.if((value) => isArrayOfType(value, 'image'), vine.array(imagePartSchema).minLength(1)),
  vine.union.if((value) => isArrayOfType(value, 'file'), vine.array(filePartSchema).minLength(1)),
  // Handle string content
  vine.union.else(vine.string().minLength(1)),
])

const userMessageSchema = vine.object({
  id: vine.string().optional(),
  role: vine.literal('user'),
  providerOptions: vine.any().optional(),
  content: userContent,
})

const assistantContent = vine.union([
  // Handle array of objects with type property
  vine.union.if((value) => isArrayOfType(value, 'text'), vine.array(textPartSchema).minLength(1)),
  vine.union.if((value) => isArrayOfType(value, 'image'), vine.array(imagePartSchema).minLength(1)),
  vine.union.if((value) => isArrayOfType(value, 'file'), vine.array(filePartSchema).minLength(1)),
  vine.union.if(
    (value) => isArrayOfType(value, 'reasoning'),
    vine.array(reasoningPartSchema).minLength(1)
  ),
  vine.union.if(
    (value) => isArrayOfType(value, 'redacted-reasoning'),
    vine.array(redactedReasoningPartSchema).minLength(1)
  ),
  vine.union.if(
    (value) => isArrayOfType(value, 'tool-call'),
    vine.array(toolCallPartSchema).minLength(1)
  ),
  vine.union.if(
    (value) => isArrayOfType(value, 'tool-result'),
    vine.array(toolResultPartSchema).minLength(1)
  ),
  // Handle string content
  vine.union.else(vine.string().minLength(1)),
])

const assistantMessageSchema = vine.object({
  id: vine.string().optional(),
  role: vine.literal('assistant'),
  providerOptions: vine.any().optional(),
  content: assistantContent,
})

const toolMessageSchema = vine.object({
  id: vine.string().optional(),
  role: vine.literal('tool'),
  content: vine.array(toolResultPartSchema).minLength(1),
  providerOptions: vine.any().optional(),
})

const coreMessageSchema = vine
  .union([
    vine.union.if((value) => hasField('role', value, 'system'), systemMessageSchema),
    vine.union.if((value) => hasField('role', value, 'user'), userMessageSchema),
    vine.union.if((value) => hasField('role', value, 'assistant'), assistantMessageSchema),
    vine.union.if((value) => hasField('role', value, 'tool'), toolMessageSchema),
  ])
  .otherwise((_, field) => {
    field.report('No messages have been sent', 'ai_message_input', field)
  })

export const chatMessageSchema = vine.compile(
  vine.object({
    chatId: vine.string().uuid().optional(),
    headers: vine.object({
      'X-Chat-Id': vine.string().uuid().optional(),
    }),
    messages: vine.array(coreMessageSchema).minLength(1),
  })
  // .allowUnknownProperties() // Enable this when other types will need to be validated
)

export type ChatMessagePayload = Infer<typeof chatMessageSchema>
