import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'oauth_logins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').references('users.id').onDelete('CASCADE').notNullable()
      table.string('provider_id').unique().notNullable()
      // TODO: Create a table with a list of supported providers and refer to it from this table
      // To use with iconify
      // table.string('provider').notNullable()
      // table.string('icon_name').notNullable()
      table.string('profile_url').nullable()
      table.string('email', 254).nullable()
      table.string('user_name').nullable()
      table.string('avatar_url').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
