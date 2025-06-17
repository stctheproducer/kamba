import React from 'react'
import ChatLayout from '@/layouts/chat'
import { Thread } from '@/components/assistant-ui/thread'
import { ThreadList } from '@/components/assistant-ui/thread-list'
import { Head } from '@inertiajs/react'

interface ChatPageProps {
  // Add props interface as needed for InertiaJS page props
  user?: {
    id: string
    name: string
    email: string
  }
  chats?: Array<{
    id: string
    title: string
    createdAt: string
  }>
}

const ChatPage = ({ user }: ChatPageProps) => {
  return (
    <>
      <Head title="Chat" />
      {/* AssistantModal component at the top level */}
      <div className="flex h-full w-full">
        {/* Chat Sidebar */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-950">
          <div className="p-4">
            <h2 className="text-sm font-medium text-zinc-400 mb-4">Chat History</h2>
            {/* ThreadList component integrated */}
            <ThreadList />
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Chat Header */}
          <header className="border-b border-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Chat</h1>
              {user && (
                <div className="text-sm text-zinc-400">
                  Welcome, {user.name}
                </div>
              )}
            </div>
          </header>

          {/* Messages Container - Thread component integrated */}
          <div className="flex-1 overflow-hidden">
            <Thread />
          </div>
        </main>
      </div>
    </>
  )
}

ChatPage.layout = (page: React.ReactNode) => ChatLayout({ children: page })

export default ChatPage

