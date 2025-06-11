import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activity_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').nullable().index()
      table.text('description')
      table.string('model_type').nullable()
      table.string('model_id').nullable()
      table.string('event').nullable()
      table.string('entity_type').nullable()
      table.string('entity_id').nullable()
      table.json('current').nullable()
      table.json('previous').nullable()
      table.string('batch_id').nullable().index()

      table.index(['model_type', 'model_id'])
      table.index(['entity_type', 'entity_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}