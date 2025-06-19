// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import type { ApplicationService } from '@adonisjs/core/types'
import { Message } from '@adonisjs/mail'
import { render as renderEmail } from '@react-email/render'

export default class MailTemplateProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    Message.templateEngine = {
      async render(template: string, data: Record<string, any>) {
        const { default: EmailComponent } = await import(`#emails/${template}`)

        // Render the template using the react-email's render function
        return renderEmail(EmailComponent({ ...data }))
      },
    }
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
