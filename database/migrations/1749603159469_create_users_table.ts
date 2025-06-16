import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('oauth_id').notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('username').nullable()
      table.string('first_name').nullable()
      table.string('middle_name').nullable()
      table.string('last_name').nullable()
      table.boolean('is_beta_user').notNullable().defaultTo(false)
      table.boolean('is_paying_user').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
