import { InferPageProps } from '@adonisjs/inertia/types'
import ChatsController from '#controllers/chats_controller'

export interface ChatIndexPage extends InferPageProps<ChatsController, 'index'> {}
