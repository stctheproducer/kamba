import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary() // UUID primary key
      table.uuid('chat_id').references('chats.id').onDelete('CASCADE').notNullable()
      table.uuid('parent_message_id').references('messages.id').onDelete('CASCADE').nullable() // For branching
      table.string('role').notNullable() // 'system', 'user', 'assistant', 'tool'
      table.text('content').notNullable()
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
