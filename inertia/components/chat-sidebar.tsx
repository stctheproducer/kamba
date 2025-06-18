import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Trash2, Edit3, ChevronLeft, ChevronRight } from 'lucide-react'
import { NewChatDropdown } from '@/components/new-chat-dropdown'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { CustomPrompt } from '@/types/prompt_types'

interface Conversation {
  id: string
  title: string
  lastActivity: string
  systemPrompt?: string
  modelId?: string
  initialMessage?: any // For branched chats
}

const mockUserPrompts: CustomPrompt[] = [
  {
    id: 'user-1',
    name: 'Code Reviewer',
    description: 'Reviews code for best practices and improvements',
    systemPrompt:
      'You are a senior code reviewer. Analyze code for best practices, security issues, and improvements.',
    recommendedModelId: 'gpt-4o',
    category: 'Development',
    isPublic: false,
    upvotes: 0,
    downvotes: 0,
    authorId: 'user123',
    authorName: 'John Doe',
    createdAt: new Date(),
  },
  {
    id: 'user-2',
    name: 'Meeting Summarizer',
    description: 'Summarizes meeting notes and action items',
    systemPrompt:
      'You are a meeting assistant. Summarize meeting notes and extract key action items and decisions.',
    recommendedModelId: 'gpt-4o-mini',
    category: 'Productivity',
    isPublic: true,
    upvotes: 12,
    downvotes: 1,
    authorId: 'user123',
    authorName: 'John Doe',
    createdAt: new Date(),
  },
]

const mockAdminPrompts: CustomPrompt[] = [
  {
    id: 'admin-1',
    name: 'Code Helper',
    description: 'Helps generate and explain code snippets',
    systemPrompt:
      'You are an expert programmer. Assist with coding tasks and explain concepts clearly.',
    recommendedModelId: 'gpt-4o',
    category: 'Development',
    isPublic: true,
    upvotes: 152,
    downvotes: 5,
    authorId: 'admin',
    authorName: 'Admin',
    createdAt: new Date(),
  },
  {
    id: 'admin-2',
    name: 'Creative Writer',
    description: 'Assists in writing stories and creative content',
    systemPrompt:
      'You are a creative writing assistant. Help brainstorm ideas and write engaging narratives.',
    recommendedModelId: 'claude-3-sonnet',
    category: 'Writing',
    isPublic: true,
    upvotes: 230,
    downvotes: 12,
    authorId: 'admin',
    authorName: 'Admin',
    createdAt: new Date(),
  },
]

export function ChatSidebar({
  conversations,
  onSelectConversation,
  currentConversationId,
  onNewChatWithPrompt,
  onNewChat,
  userPlan = 'free',
  isCollapsed = false,
  onToggleCollapse,
}: {
  conversations: Conversation[]
  onSelectConversation: (id: string | null) => void
  currentConversationId: string | null
  onNewChatWithPrompt?: (prompt: CustomPrompt) => void
  onNewChat: () => void
  userPlan?: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}) {
  const [localConversations, setLocalConversations] = useState<Conversation[]>(conversations)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState<string>('')

  // Update local conversations when prop changes
  useEffect(() => {
    setLocalConversations(conversations)
  }, [conversations])

  const handleNewChat = () => {
    onNewChat()
  }

  const handleNewChatWithPrompt = (prompt: CustomPrompt) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Chat with ${prompt.name}`,
      lastActivity: 'Just now',
      systemPrompt: prompt.systemPrompt,
      modelId: prompt.recommendedModelId,
    }
    setLocalConversations([newConversation, ...localConversations])
    onSelectConversation(newConversation.id)
    onNewChatWithPrompt?.(prompt)
  }

  const handleDeleteChat = (id: string) => {
    setLocalConversations(localConversations.filter((conv) => conv.id !== id))
    if (currentConversationId === id) {
      onSelectConversation(
        localConversations.length > 1 ? localConversations.find((c) => c.id !== id)!.id : null
      )
    }
  }

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id)
    setEditingTitle(conversation.title)
  }

  const handleSaveEdit = (id: string) => {
    setLocalConversations(
      localConversations.map((conv) => (conv.id === id ? { ...conv, title: editingTitle } : conv))
    )
    setEditingId(null)
  }

  // Listen for branch creation events
  useEffect(() => {
    const handleBranchCreation = (event: any) => {
      const { id, title, initialMessage } = event.detail

      const newConversation: Conversation = {
        id,
        title,
        lastActivity: 'Just now',
        initialMessage,
      }

      setLocalConversations((prevConversations) => [newConversation, ...prevConversations])
      onSelectConversation(id)
    }

    window.addEventListener('createBranchedChat', handleBranchCreation)

    return () => {
      window.removeEventListener('createBranchedChat', handleBranchCreation)
    }
  }, [onSelectConversation])

  return (
    <div
      className={`${isCollapsed ? 'w-16' : 'w-72'} bg-zinc-950 border-r border-zinc-800 flex flex-col h-full transition-all duration-300 ease-in-out`}
    >
      {/* Header with collapse button */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-semibold">Kamba</span>
          </div>
        )}
        {onToggleCollapse && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('h-8 w-8', isCollapsed && 'mx-auto')}
                  onClick={onToggleCollapse}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isCollapsed ? 'right' : 'left'}>
                {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-4">
          <NewChatDropdown
            onNewChat={handleNewChat}
            onNewChatWithPrompt={handleNewChatWithPrompt}
            userPrompts={mockUserPrompts}
            adminPrompts={mockAdminPrompts}
            userPlan={userPlan}
          />
        </div>
      )}

      {isCollapsed && (
        <div className="p-2">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full h-10" onClick={handleNewChat}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">New Chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {localConversations.map((conv) => (
            <div key={conv.id}>
              {isCollapsed ? (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`group flex items-center justify-center p-3 rounded-md cursor-pointer hover:bg-zinc-800 ${
                          currentConversationId === conv.id ? 'bg-zinc-800' : ''
                        }`}
                        onClick={() => onSelectConversation(conv.id)}
                      >
                        <MessageSquare className="h-4 w-4 text-zinc-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="max-w-xs">
                        <div className="font-medium">{conv.title}</div>
                        <div className="text-xs text-zinc-400">{conv.lastActivity}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div
                  className={`group flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-zinc-800 ${
                    currentConversationId === conv.id ? 'bg-zinc-800' : ''
                  }`}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MessageSquare className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                    {editingId === conv.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => handleSaveEdit(conv.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(conv.id)}
                        className="bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 py-0.5 w-full"
                        autoFocus
                      />
                    ) : (
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm truncate" title={conv.title}>
                          {conv.title}
                        </span>
                        <span className="text-xs text-zinc-500">{conv.lastActivity}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId !== conv.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartEdit(conv)
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteChat(conv.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      {!isCollapsed && (
        <div className="p-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500">Local-First Storage: Active</p>
        </div>
      )}
      {isCollapsed && (
        <div className="p-2 border-t border-zinc-800 flex justify-center">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </TooltipTrigger>
              <TooltipContent side="right">Local-First Storage: Active</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}
