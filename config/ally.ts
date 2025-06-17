import env from '#start/env'
import { logto } from '#drivers/logto_driver'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  logto: logto({
    clientId: env.get('LOGTO_CLIENT_ID', ''),
    clientSecret: env.get('LOGTO_CLIENT_SECRET', ''),
    callbackUrl: env.get('LOGTO_REDIRECT_URI', ''),
    endpoint: env.get('LOGTO_ENDPOINT', ''),
  }),
  github: services.github({
    clientId: env.get('GITHUB_CLIENT_ID', ''),
    clientSecret: env.get('GITHUB_CLIENT_SECRET', ''),
    callbackUrl: env.get('GITHUB_REDIRECT_URI', ''),
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
