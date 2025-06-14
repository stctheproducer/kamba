import { defineConfig, drivers } from '@foadonis/maintenance'

export default defineConfig({
  default: 'cache',
  drivers: {
    file: drivers.file(),
    cache: drivers.cache(),
  },
})
