import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.text('user_type').nullable()
      table.uuid('user_id').nullable()

      table.text('event').notNullable()

      table.text('auditable_type').notNullable()
      table.uuid('auditable_id').notNullable()

      table.jsonb('old_values').nullable()
      table.jsonb('new_values').nullable()

      table.jsonb('metadata').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
