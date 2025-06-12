import { defineConfig } from '@adonisjs/transmit'
import { redis } from '@adonisjs/transmit/transports'

export default defineConfig({
  pingInterval: false,
  transport: {
    driver: redis({
      connectionName: 'transmit',
    }),
  },
})
