// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary() // UUID primary key
      table.uuid('user_id').references('users.id').onDelete('CASCADE').notNullable()
      table.string('title').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable() // Soft delete column
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
