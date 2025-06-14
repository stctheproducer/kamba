import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as stringHelpers from '@adonisjs/core/helpers/string'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(fileURLToPath(import.meta.url))

export default class MakeAction extends BaseCommand {
  static commandName = 'make:action'
  static description = 'Create a new action class'
  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
  }

  @args.string({
    description: 'Name of the action (e.g., ChargeUser)',
    name: 'name',
  })
  declare name: string

  @args.string({
    description: 'Name of the model to import (e.g., User)',
    name: 'model',
  })
  declare model: string

  @args.string({
    description: 'Optional category for organizing actions (e.g., auth, billing)',
    required: false,
    name: 'category',
  })
  declare category?: string

  @flags.boolean({
    description: 'Force creation even if the file already exists',
    default: false,
  })
  declare force: boolean

  @flags.boolean({
    description: 'Show help for the make:action command',
    default: false,
  })
  declare help: boolean

  /**
   * Get the template for the action class
   */
  private async getTemplate() {
    const stubPath = join(__dirname, '../../../templates/action.stub')

    try {
      const stub = await readFile(stubPath, 'utf-8')
      return stub
        .replace(/\{\{\s*model\s*\}\}/g, this.model)
        .replace(/\{\{\s*modelPath\s*\}\}/g, this.model.toLowerCase())
        .replace(/\{\{\s*name\s*\}\}/g, this.name.replace(/Action$/, ''))
        .replace(/\{\{\s*modelInstance\s*\}\}/g, this.model.toLowerCase())
    } catch (error) {
      this.logger.warning(`Using default template (${error.message})`)
      return `import { AsAction } from '@foadonis/actions'
import ${this.model} from '#models/${this.model.toLowerCase()}'

export default class ${this.name} implements AsAction {
  handle(${this.model.toLowerCase()}: ${this.model}) {
    // Your business logic here
  }
}`
    }
  }

  /**
   * Configure the command
   */
  static usage = [
    'make:action <name> <model> [category]',
    'make:action ChargeUser User',
    'make:action CreateCheckoutSession Payment billing',
  ]

  /**
   * Example command line instructions
   */
  static examples = [
    'node ace make:action ChargeUser User',
    'node ace make:action CreateCheckoutSession Payment billing --force',
  ]

  /**
   * Normalize the action name
   */
  private normalizeName(name: string): string {
    return (stringHelpers as any).pascalCase(name).replace(/Action$/i, '') + 'Action'
  }

  /**
   * Normalize the model name
   */
  private normalizeModel(model: string): string {
    return (stringHelpers as any).pascalCase(model)
  }

  /**
   * Show help for the command
   */
  protected async showHelp() {
    this.ui
      .sticker()
      .add('Examples:')
      .add('  node ace make:action ChargeUser User')
      .add('  node ace make:action CreateCheckoutSession Payment billing')
      .add('  node ace make:action SendWelcomeEmail User --force')
      .render()
  }

  /**
   * Execute the command
   */
  async run() {
    if (this.help) {
      return this.showHelp()
    }

    // Normalize inputs
    this.name = this.normalizeName(this.name)
    this.model = this.normalizeModel(this.model)

    // Create the actions directory if it doesn't exist
    const baseDir = this.app.makePath('app/actions')
    const categoryDir = this.category ? join(baseDir, this.category) : baseDir

    try {
      // Create directory structure if it doesn't exist
      if (!existsSync(categoryDir)) {
        await mkdir(categoryDir, { recursive: true })
        this.logger.action('create').succeeded()
      }

      // Determine the file path
      const actionName = this.name.replace(/Action$/, '')
      const fileName = `${(stringHelpers as any).snakeCase(actionName)}.ts`
      const filePath = join(categoryDir, fileName)

      // Check if file already exists
      if (existsSync(filePath) && !this.force) {
        this.logger.error(`Action ${filePath} already exists. Use --force to overwrite.`)
        return
      }

      // Get and process the template
      const template = await this.getTemplate()

      // Write the action file
      await writeFile(filePath, template)
      this.logger.action(this.force ? 'force create' : 'create').succeeded()

      this.logger.success('Action created successfully!')
    } catch (error) {
      this.logger.error(`Failed to create action: ${error.message}`)
      this.exitCode = 1
    }
  }
}
