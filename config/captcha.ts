import env from '#start/env'
import { defineConfig, services } from 'adonis-captcha-guard'

const captchaConfig = defineConfig({
  turnstile: services.turnstile({
    siteKey: env.get('TURNSTILE_SITE_KEY'),
    secret: env.get('TURNSTILE_SECRET'),
  }),
  recaptcha: services.recaptcha({
    siteKey: env.get('RECAPTCHA_SITE_KEY'),
    secret: env.get('RECAPTCHA_SECRET'),
  }),
})

export default captchaConfig

declare module '@adonisjs/core/types' {
  interface CaptchaProviders extends InferCaptchaProviders<typeof captchaConfig> {}
}