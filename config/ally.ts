import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  logto: services.logto({
    clientId: env.get('LOGTO_CLIENT_ID', ''),
    clientSecret: env.get('LOGTO_CLIENT_SECRET', ''),
    callbackUrl: env.get('LOGTO_REDIRECT_URI', ''),
  }),
  github: services.github({
    clientId: env.get('GITHUB_CLIENT_ID', ''),
    clientSecret: env.get('GITHUB_CLIENT_SECRET', ''),
    callbackUrl: '',
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
