import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import ChatLayout from '@/layouts/chat'
import { Thread } from '@/components/assistant-ui/thread'
import { ThreadList } from '@/components/assistant-ui/thread-list'
import { EnhancedModelSelector } from '@/components/enhanced-model-selector'
import { NewChatDropdown } from '@/components/new-chat-dropdown'
import { Head, router, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Settings,
  Share2,
  Bot,
  User,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatIndexPage } from '@/types/chat'
import type { CustomPrompt } from '@/types/prompt_types'
import { AssistantRuntimeProvider } from '@assistant-ui/react'
import { useChatRuntime } from '@assistant-ui/react-ai-sdk'
import { SharedProps } from '@adonisjs/inertia/types'

// interface ChatPageProps {
//   user?: {
//     id: string
//     name: string
//     email: string
//   }
//   chats?: Array<{
//     id: string
//     title: string
//     createdAt: string
//   }>
//   sidebarCollapsed?: boolean
// }


const ChatPage = () => {
  // const chats = []
  const { props } = usePage<ChatIndexPage>()
  const { user, chatSidebarCollapsed } = props

  // Sidebar state management with localStorage persistence
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed')
      return saved ? JSON.parse(saved) : (chatSidebarCollapsed ?? false)
    }
    return chatSidebarCollapsed ?? false
  })

  // Mobile-specific states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileModelSelectorOpen, setIsMobileModelSelectorOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Model selector state
  const [selectedModelId, setSelectedModelId] = useState('gpt-4o-mini')
  const [customApiKeys, setCustomApiKeys] = useState<Record<string, string>>({})

  // New chat functionality state
  const [isNewChatPopoverOpen, setIsNewChatPopoverOpen] = useState(false)

  // Mock data for prompts - in real app, this would come from props or API
  const adminPrompts: CustomPrompt[] = [
    {
      id: '1',
      name: 'Code Review Assistant',
      description: 'Help review and improve code quality',
      systemPrompt: 'You are a senior software engineer helping with code reviews.',
      recommendedModelId: 'gpt-4o',
      category: 'Development',
      isPublic: true,
      upvotes: 0,
      downvotes: 0,
      authorId: 'admin',
      authorName: 'Admin',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Writing Assistant',
      description: 'Help with writing and editing content',
      systemPrompt: 'You are a professional writing assistant.',
      recommendedModelId: 'gpt-4o-mini',
      category: 'Writing',
      isPublic: true,
      upvotes: 0,
      downvotes: 0,
      authorId: 'admin',
      authorName: 'Admin',
      createdAt: new Date(),
    },
  ]

  const userPrompts: CustomPrompt[] = []

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Auto-collapse sidebar on mobile
      if (mobile && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isSidebarCollapsed])

  // Handle sidebar toggle with persistence
  const handleToggleSidebar = useCallback(() => {
    const newCollapsed = !isSidebarCollapsed
    setIsSidebarCollapsed(newCollapsed)

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed))
    }

    const updatePreference = async () => {
      try {
        await axios.put('/api/preferences/sidebar-collapsed', {
          sidebarCollapsed: newCollapsed,
        })
      } catch (error) {
        console.error('Error updating sidebar preference:', error)
      }
    }
    updatePreference()
  }, [isSidebarCollapsed])

  // Handle model selection
  const handleModelChange = useCallback((modelId: string) => {
    setSelectedModelId(modelId)
  }, [])

  // Handle API key changes
  const handleApiKeyChange = useCallback((modelId: string, apiKey: string) => {
    setCustomApiKeys((prev) => ({ ...prev, [modelId]: apiKey }))
  }, [])

  // Handle mobile menu close when model is selected
  const handleMobileModelChange = useCallback((modelId: string) => {
    setSelectedModelId(modelId)
    setIsMobileModelSelectorOpen(false)
  }, [])

  // Handle new chat functionality
  const handleNewChat = useCallback(() => {
    // In a real app, this would create a new chat thread
    console.log('Creating new chat')
    setIsNewChatPopoverOpen(false)
  }, [])

  const handleNewChatWithPrompt = useCallback((prompt: CustomPrompt) => {
    // In a real app, this would create a new chat with the selected prompt
    console.log('Creating new chat with prompt:', prompt.name)
    setIsNewChatPopoverOpen(false)
  }, [])

  return (
    <>
      <Head title="Chat" />
      <div className="flex h-full w-full">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            'hidden md:flex flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300 ease-in-out',
            isSidebarCollapsed ? 'w-16' : 'w-64'
          )}
          aria-expanded={!isSidebarCollapsed}
          aria-controls="sidebar-content"
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              {!isSidebarCollapsed && (
                <h2 className="text-sm font-medium text-zinc-400">Chat History</h2>
              )}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleSidebar}
                      className="h-8 w-8 text-zinc-400 hover:text-zinc-200"
                      aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                      {isSidebarCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronLeft className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Sidebar Content */}
          <div id="sidebar-content" className="flex-1 overflow-hidden flex flex-col">
            {isSidebarCollapsed ? (
              // Collapsed sidebar - show only icons
              <>
                {/* Main content area */}
                <div className="flex-1 p-2 space-y-2">
                  {/* Direct New Thread Button */}
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleNewChat}
                          className="w-full h-10 text-zinc-400 hover:text-zinc-200"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">New Thread</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Recent Chats Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-full h-10 text-zinc-400 hover:text-zinc-200"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">Recent Chats</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      align="start"
                      className="w-80 bg-zinc-900 border-zinc-700 p-0"
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <MessageSquare className="h-4 w-4 text-white" />
                          <h3 className="text-sm font-medium text-white">Recent Chats</h3>
                        </div>

                        <ScrollArea className="h-64">
                          <div className="space-y-1">
                            {/* Mock recent chats - in real app, this would come from props or API */}
                            {[
                              { id: '1', title: 'Code Review Discussion', timestamp: '2 hours ago' },
                              { id: '2', title: 'API Design Questions', timestamp: '1 day ago' },
                              { id: '3', title: 'Database Schema Help', timestamp: '2 days ago' },
                              { id: '4', title: 'React Component Optimization', timestamp: '3 days ago' },
                              { id: '5', title: 'TypeScript Error Debugging', timestamp: '1 week ago' },
                              { id: '6', title: 'Performance Optimization Tips', timestamp: '1 week ago' },
                              { id: '7', title: 'CSS Grid Layout Help', timestamp: '2 weeks ago' },
                              { id: '8', title: 'Authentication Implementation', timestamp: '2 weeks ago' },
                            ].map((chat) => (
                              <Button
                                key={chat.id}
                                variant="ghost"
                                className="w-full justify-start text-left text-white hover:bg-zinc-800 hover:text-white h-auto p-2"
                                onClick={() => {
                                  // In real app, this would navigate to the chat
                                  console.log('Navigate to chat:', chat.id)
                                }}
                              >
                                <div className="flex flex-col items-start w-full">
                                  <span className="text-sm font-medium line-clamp-1">{chat.title}</span>
                                  <span className="text-xs text-zinc-400">{chat.timestamp}</span>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Bottom section with separator and settings */}
                <div className="p-2">
                  <hr className="border-zinc-800 mb-2" />
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-full h-10 text-zinc-400 hover:text-zinc-200"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            ) : (
              // Expanded sidebar - show full content
              <>
                {/* New Chat Section */}
                <div className="p-4 border-b border-zinc-800">
                  <NewChatDropdown
                    onNewChat={handleNewChat}
                    onNewChatWithPrompt={handleNewChatWithPrompt}
                    userPrompts={userPrompts}
                    adminPrompts={adminPrompts}
                    userPlan="free"
                  />
                </div>

                {/* Main content area */}
                <div className="flex-1 p-4 overflow-hidden">
                  <ThreadList />
                </div>

                {/* Bottom section with separator and settings */}
                <div className="p-4 pt-0">
                  <hr className="border-zinc-800 mb-4" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-zinc-400 hover:text-zinc-200"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Desktop Header */}
          <header className="hidden md:flex h-16 border-b border-zinc-800 bg-zinc-900 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-teal-400" />
                <h1 className="text-lg font-semibold text-white">Kamba</h1>
              </div>
            </div>

            {/* Center: Model Selector */}
            <div className="flex-1 flex justify-center max-w-md">
              <EnhancedModelSelector
                selectedModelId={selectedModelId}
                onModelChange={handleModelChange}
                userPlan="free"
                customApiKeys={customApiKeys}
                onApiKeyChange={handleApiKeyChange}
                variant="desktop"
              />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-zinc-200"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share Chat</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {user && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-zinc-200"
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-zinc-400">{user.email}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </header>

          {/* Mobile Header */}
          <header className="md:hidden h-14 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-4">
            {/* Left: Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-zinc-200"
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-zinc-900 border-zinc-700 p-0">
                <SheetHeader className="p-4 border-b border-zinc-700">
                  <SheetTitle className="text-white text-left">Menu</SheetTitle>
                </SheetHeader>

                {/* Mobile New Chat Section */}
                <div className="p-4 border-b border-zinc-700">
                  <NewChatDropdown
                    onNewChat={() => {
                      handleNewChat()
                      setIsMobileMenuOpen(false)
                    }}
                    onNewChatWithPrompt={(prompt) => {
                      handleNewChatWithPrompt(prompt)
                      setIsMobileMenuOpen(false)
                    }}
                    userPrompts={userPrompts}
                    adminPrompts={adminPrompts}
                    userPlan="free"
                  />
                </div>

                <div className="flex-1 overflow-hidden">
                  <ThreadList />
                </div>

                {/* Mobile Settings Section */}
                <div className="p-4 border-t border-zinc-700">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-zinc-400 hover:text-zinc-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Center: Logo */}
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-teal-400" />
              <h1 className="text-base font-semibold text-white">Kamba</h1>
            </div>

            {/* Right: Model Selector */}
            <Sheet open={isMobileModelSelectorOpen} onOpenChange={setIsMobileModelSelectorOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-zinc-400 hover:text-zinc-200"
                  aria-label="Select model"
                >
                  <Bot className="h-3 w-3 mr-1" />
                  <span className="max-w-16 truncate">{selectedModelId.split('-')[0]}</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[80vh] bg-zinc-900 border-zinc-700 rounded-t-lg"
              >
                <SheetHeader className="pb-4">
                  <SheetTitle className="text-white text-left">Select Model</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-hidden">
                  <EnhancedModelSelector
                    selectedModelId={selectedModelId}
                    onModelChange={handleMobileModelChange}
                    userPlan="free"
                    customApiKeys={customApiKeys}
                    onApiKeyChange={handleApiKeyChange}
                    variant="mobile"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </header>

          {/* Messages Container */}
          <div className="flex-1 overflow-hidden">
            <Thread />
          </div>
        </main>
      </div>
    </>
  )
}

const RuntimeChatWrapper = () => {
  const { props } = usePage<ChatIndexPage>()

  if (props.id) {
    router.visit(`/chat/${props.id}`)
  }

  const runtime = useChatRuntime({
    api: '/api/chat',
    headers: async () => {
      const headers = new Headers()
      if (props.id) {
        headers.set('X-Chat-Id', props.id)
      }
      headers.set('X-XSRF-TOKEN', document.cookie.match(/XSRF-TOKEN=([^;]*)/)?.[1] || '')
      return headers
    },
    body: {
      chatId: props.id
    },
    onResponse(response) {
      const chatId = response.headers.get('X-Chat-Id')
      if (!props.id && chatId) {
        router.visit(`/chat/${chatId}`)
      }
    },
    onError(error) {
      return error.message
    }
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ChatPage />
    </AssistantRuntimeProvider>
  )
}

RuntimeChatWrapper.layout = (page: React.ReactNode) => ChatLayout({ children: page })

export default RuntimeChatWrapper
