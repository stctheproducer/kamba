import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/shield'

const shieldConfig = defineConfig({
  /**
   * Configure CSP policies for your app. Refer documentation
   * to learn more
   */
  csp: {
    enabled: app.inProduction,
    directives: {
      defaultSrc: ['self'],
      scriptSrc: ['self', 'https://cdnjs.cloudflare.com'],
      styleSrc: ['self', 'https://cdnjs.cloudflare.com'],
      imgSrc: ['self', 'data:'],
      fontSrc: ['self'],
      connectSrc: [
        'self',
        'https://api.openai.com',
        'https://api.deepseek.com',
        'https://api.perplexity.ai',
        'https://api.anthropic.com',
        'https://api.google.com',
        'https://api.openrouter.com',
      ],
      frameSrc: ['self'],
      reportUri: ['/csp-report'],
    },
    reportOnly: true,
  },

  /**
   * Configure CSRF protection options. Refer documentation
   * to learn more
   */
  csrf: {
    enabled: true,
    exceptRoutes: [],
    enableXsrfCookie: true,
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },

  /**
   * Control how your website should be embedded inside
   * iFrames
   */
  xFrame: {
    enabled: true,
    action: 'DENY',
  },

  /**
   * Force browser to always use HTTPS
   */
  hsts: {
    enabled: true,
    maxAge: '180 days',
  },

  /**
   * Disable browsers from sniffing the content type of a
   * response and always rely on the "content-type" header.
   */
  contentTypeSniffing: {
    enabled: true,
  },
})

export default shieldConfig
