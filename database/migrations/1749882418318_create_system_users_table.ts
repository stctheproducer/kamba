// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'system_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('first_name').nullable()
      table.string('middle_name').nullable()
      table.string('last_name').nullable()
      table.string('role').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
