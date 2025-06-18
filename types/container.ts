import { OpenRouterProvider } from '@openrouter/ai-sdk-provider'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    openrouter: OpenRouterProvider
  }
}
