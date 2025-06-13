import { createTuyau } from '@tuyau/client'
import { api } from '#api'

export const tuyau = createTuyau({
  api,
  baseUrl: 'http://127.0.0.1:3333',
})
