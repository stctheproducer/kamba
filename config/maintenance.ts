import { defineConfig, drivers } from '@foadonis/maintenance'

export default defineConfig({
  default: 'file',
  drivers: {
    file: drivers.file(),
  },
})
