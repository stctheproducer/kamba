// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import { InferPageProps } from '@adonisjs/inertia/types'
import ChatsController from '#controllers/chats_controller'

export interface ChatIndexPage extends InferPageProps<ChatsController, 'index'> {}
