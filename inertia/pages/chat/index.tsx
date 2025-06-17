import { ChatIndex } from "@/types/chat"
import { Head } from "@inertiajs/react"
import { Subscription, Transmit } from '@adonisjs/transmit-client'
import { usePage } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatSidebar } from "@/components/chat-sidebar"
import { Bot, Menu, Settings, Share2, Paperclip, Send, ImageIcon, Search, User, Copy, RotateCcw, Trash2, GitFork } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ModelSelector } from "@/components/model-selector"
import type { CustomPrompt } from "@/types/prompt_types"
import ChatLayout from "@/layouts/chat"

interface Conversation {
  id: string
  title: string
  lastActivity: string
  systemPrompt?: string
  modelId?: string
  initialMessage?: any
}

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

// Helper function to format timestamps
const formatTimestamp = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return timestamp.toLocaleDateString()
}

export default function Chat() {
  const page = usePage<ChatIndex>()

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null)
  const [sseError, setSseError] = useState<string | null>(null)
  const [selectedModelId, setSelectedModelId] = useState("gpt-4o-mini")
  const subscription = useRef<Subscription | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "React Component Help", lastActivity: "5m ago" },
    { id: "2", title: "Python Script for CSV", lastActivity: "1h ago" },
    { id: "3", title: "Marketing Slogan Ideas", lastActivity: "3h ago" },
  ])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Load sidebar state from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  useEffect(() => {
    const transmit = new Transmit({
      baseUrl: window.location.origin
    })
    const sub = transmit.subscription(`chats/${page.props.user?.id}`)

    async function init() {
      await sub.create()
      subscription.current = sub
    }

    async function cleanup() {
      if (subscription.current) {
        await subscription.current.delete()
      }
    }
    init()

    return () => {
      cleanup()
    }
  }, [page.props.user?.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setSseError(null)
      setStreamingMessage(null)

      subscription.current?.onMessage((data: any) => {
        setStreamingMessage((prev) => (prev ?? "") + data)
      })

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        role: 'user',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
      setNewMessage("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage()
  }

  const handleSelectConversation = (conversationId: string | null) => {
    setSelectedConversationId(conversationId)
    // Clear current messages and load messages for the selected conversation
    setMessages([])
    setStreamingMessage(null)
    setSseError(null)
  }

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      lastActivity: "Just now",
    }
    setConversations([newConversation, ...conversations])
    setSelectedConversationId(newConversation.id)
    setMessages([])
    setStreamingMessage(null)
    setSseError(null)
  }

  const handleNewChatWithPrompt = (prompt: CustomPrompt) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Chat with ${prompt.name}`,
      lastActivity: "Just now",
      systemPrompt: prompt.systemPrompt,
      modelId: prompt.recommendedModelId,
    }
    setConversations([newConversation, ...conversations])
    setSelectedConversationId(newConversation.id)
    setMessages([])
    setStreamingMessage(null)
    setSseError(null)
  }

  // Message action handlers
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleRegenerateMessage = (messageId: string) => {
    // Find the message and regenerate from that point
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex > 0) {
      const previousUserMessage = messages[messageIndex - 1]
      if (previousUserMessage.role === 'user') {
        // Remove messages from this point and regenerate
        setMessages(prev => prev.slice(0, messageIndex))
        // Trigger regeneration with the previous user message
        // This would typically involve calling the AI API again
      }
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId))
  }

  const handleBranchMessage = (messageId: string) => {
    // Create a new conversation branch from this message
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex >= 0) {
      const branchMessages = messages.slice(0, messageIndex + 1)
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: "Branched Chat",
        lastActivity: "Just now",
      }
      setConversations([newConversation, ...conversations])
      setSelectedConversationId(newConversation.id)
      setMessages(branchMessages)
    }
  }

  // Effect to handle streaming message completion
  useEffect(() => {
    if (streamingMessage && !subscription.current) {
      // Streaming completed, add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: streamingMessage,
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setStreamingMessage(null)
    }
  }, [streamingMessage, subscription.current])

  // Handle sidebar collapse toggle
  const handleToggleSidebarCollapse = () => {
    const newCollapsed = !isSidebarCollapsed
    setIsSidebarCollapsed(newCollapsed)
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed))
    }
  }

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true)
      }
    }

    handleResize() // Check on mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <ChatLayout>
      <Head title="Chat - Kamba" />

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <ChatSidebar
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          currentConversationId={selectedConversationId}
          onNewChatWithPrompt={handleNewChatWithPrompt}
          onNewChat={handleNewChat}
          userPlan="free"
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header Bar */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-semibold">Kamba</h1>
            </div>
          </div>

          {/* Center: Model Selector */}
          <div className="flex-1 flex justify-center">
            <div className="hidden sm:block">
              <ModelSelector
                selectedModelId={selectedModelId}
                onModelChange={setSelectedModelId}
                userPlan="free"
              />
            </div>
            {/* Mobile model selector - show as compact version */}
            <div className="sm:hidden">
              <ModelSelector
                selectedModelId={selectedModelId}
                onModelChange={setSelectedModelId}
                userPlan="free"
              />
            </div>
          </div>

          {/* Right side: Share and Settings buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {messages.length === 0 && !streamingMessage && (
                <div className="flex items-center justify-center h-full text-zinc-500">
                  <div className="text-center">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                    <p className="text-lg mb-2">Start a conversation</p>
                    <p className="text-sm">Ask me anything or choose a prompt to get started.</p>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className="space-y-2 group">
                  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 mr-3">
                        <Bot className="h-8 w-8 p-1.5 bg-zinc-800 rounded-full text-primary" />
                      </div>
                    )}

                    <div className={`max-w-[80%] group`}>
                      <div className={`p-3 rounded-lg ${message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-zinc-800 text-white'
                        }`}>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0 ml-3">
                        <User className="h-8 w-8 p-1.5 bg-primary rounded-full text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Action buttons and timestamp positioned below the bubble */}
                  <div className={`flex ${message.role === 'user' ? 'justify-end pr-11' : 'justify-start pl-11'} group`}>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200"
                              onClick={() => handleCopyMessage(message.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            Copy message
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {message.role === 'assistant' && (
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200"
                                onClick={() => handleRegenerateMessage(message.id)}
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Regenerate</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200"
                              onClick={() => handleDeleteMessage(message.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            Delete message
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200"
                              onClick={() => handleBranchMessage(message.id)}
                            >
                              <GitFork className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            Branch conversation
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Timestamp */}
                      <span className="text-xs text-zinc-500 ml-2">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {streamingMessage && (
                <div className="flex justify-start">
                  <div className="flex-shrink-0 mr-3">
                    <Bot className="h-8 w-8 p-1.5 bg-zinc-800 rounded-full text-primary animate-pulse" />
                  </div>

                  <div className="max-w-[80%] relative group">
                    <div className="p-3 rounded-lg bg-zinc-800 text-white">
                      <div className="text-sm whitespace-pre-wrap">{streamingMessage}</div>
                    </div>

                    <div className="absolute bottom-2 left-2 flex flex-col items-start gap-1">
                      <span className="text-xs text-zinc-500">Generating...</span>
                      <span className="text-xs text-zinc-500 opacity-70">
                        {formatTimestamp(new Date())}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {sseError && (
                <div className="flex justify-center">
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
                    {sseError}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t border-zinc-800 p-4 bg-zinc-900">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" disabled>
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upload files (Plus)</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" disabled>
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Generate image (Pro)</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" disabled>
                      <Search className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Web search (Pro)</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <input
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Ask me anything, or type /imagine, /search..."
                className="flex-1 p-3 rounded-md bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 h-11"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />

              <Button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 h-11"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}

// Configure the page to use the chat layout
; (Chat as any).layout = (page: React.ReactElement) => <ChatLayout>{page}</ChatLayout>
