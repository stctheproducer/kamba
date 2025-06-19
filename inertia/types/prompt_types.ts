// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
export interface CustomPrompt {
  id: string
  name: string
  description: string
  systemPrompt: string
  recommendedModelId: string
  category: string
  isPublic: boolean
  upvotes: number
  downvotes: number
  authorId: string
  authorName: string
  createdAt: Date
}
