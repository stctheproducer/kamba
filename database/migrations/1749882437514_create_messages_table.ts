// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('response_id', 128).nullable().index()
      table.uuid('chat_id').references('chats.id').onDelete('CASCADE').notNullable()
      table.uuid('parent_message_id').references('messages.id').onDelete('CASCADE').nullable() // For branching
      table.string('role', 64).notNullable().index() // 'system', 'user', 'assistant', 'tool'
      table.string('model', 64).notNullable().index() // e.g., 'gpt-3.5-turbo'
      table.text('text').notNullable() // Message text only
      table.integer('prompt_tokens').nullable().index()
      table.integer('completion_tokens').nullable().index()
      table.integer('total_tokens').nullable().index()
      table.jsonb('content').notNullable() // Message content incl. messages array
      table.jsonb('metadata').nullable() // e.g., tool calls, source documents
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable() // Soft delete column
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
