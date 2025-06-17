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
