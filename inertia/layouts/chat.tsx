import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { useChatRuntime } from "@assistant-ui/react-ai-sdk"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const runtime = useChatRuntime({
    api: '/api/chat'
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-screen w-full flex bg-zinc-900 text-white">
        {children}
      </div>
    </AssistantRuntimeProvider>
  )
}