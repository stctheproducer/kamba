import { InferPageProps } from '@adonisjs/inertia/types'
import ChatsController from '#controllers/chats_controller'

export interface ChatIndex extends InferPageProps<ChatsController, 'index'> {}
