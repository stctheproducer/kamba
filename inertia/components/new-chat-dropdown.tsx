import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, ChevronDown, Search, Zap, MessageSquare } from "lucide-react"
import type { CustomPrompt } from "@/types/prompt-types"
import { Badge } from "@/components/ui/badge"

interface NewChatDropdownProps {
  onNewChat: () => void
  onNewChatWithPrompt: (prompt: CustomPrompt) => void
  userPrompts: CustomPrompt[]
  adminPrompts: CustomPrompt[]
  userPlan: string
}

export function NewChatDropdown({
  onNewChat,
  onNewChatWithPrompt,
  userPrompts,
  adminPrompts,
  userPlan,
}: NewChatDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [dropdownHeight, setDropdownHeight] = useState("auto")

  // Get all unique categories
  const allCategories = [
    ...new Set([...adminPrompts.map((p) => p.category), ...userPrompts.map((p) => p.category)].filter(Boolean)),
  ] as string[]

  // Filter prompts based on search term and category
  const filteredUserPrompts = userPrompts.filter(
    (prompt) =>
      (prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCategory || prompt.category === selectedCategory),
  )

  const filteredAdminPrompts = adminPrompts.filter(
    (prompt) =>
      (prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCategory || prompt.category === selectedCategory),
  )

  const handlePromptSelect = (prompt: CustomPrompt) => {
    onNewChatWithPrompt(prompt)
    setIsOpen(false)
    setSearchTerm("")
    setSelectedCategory(null)
  }

  const handleNewChat = () => {
    onNewChat()
    setIsOpen(false)
  }

  // Clear search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
      setSelectedCategory(null)
    }
  }, [isOpen])

  // Adjust dropdown height based on viewport
  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight
      const maxHeight = Math.min(500, viewportHeight * 0.7) // 70% of viewport height or 500px, whichever is smaller
      setDropdownHeight(`${maxHeight}px`)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="w-full gap-2">
          <PlusCircle className="h-4 w-4" />
          New Chat
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 bg-zinc-900 border-zinc-700"
        align="start"
        style={{ maxHeight: dropdownHeight, overflow: "hidden" }}
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Start New Chat
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-700" />

        <div className="p-2">
          <Button onClick={handleNewChat} variant="ghost" className="w-full justify-start gap-2">
            <PlusCircle className="h-4 w-4" />
            Blank Chat
          </Button>
        </div>

        {(adminPrompts.length > 0 || (userPrompts.length > 0 && userPlan !== "free")) && (
          <>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <div className="p-2 space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-zinc-800 border-zinc-700 h-9"
                />
              </div>

              {allCategories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant={selectedCategory === null ? "secondary" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Button>
                  {allCategories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "secondary" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <ScrollArea className="max-h-[calc(100%-120px)]">
          {/* Admin Prompts */}
          {filteredAdminPrompts.length > 0 && (
            <>
              <DropdownMenuLabel className="flex items-center gap-2 text-xs text-zinc-300">
                <Zap className="h-3 w-3" />
                Admin Recommended
              </DropdownMenuLabel>
              {filteredAdminPrompts.map((prompt) => (
                <DropdownMenuItem
                  key={prompt.id}
                  onClick={() => handlePromptSelect(prompt)}
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-zinc-800"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="font-medium text-sm">{prompt.name}</div>
                    {prompt.category && (
                      <Badge variant="outline" className="text-xs">
                        {prompt.category}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-zinc-300 line-clamp-2">{prompt.description}</div>
                  <div className="text-xs text-zinc-400">Model: {prompt.recommendedModelId}</div>
                </DropdownMenuItem>
              ))}
            </>
          )}

          {/* User Prompts */}
          {filteredUserPrompts.length > 0 && userPlan !== "free" && (
            <>
              {filteredAdminPrompts.length > 0 && <DropdownMenuSeparator className="bg-zinc-700" />}
              <DropdownMenuLabel className="text-xs text-zinc-300">My Custom Prompts</DropdownMenuLabel>
              {filteredUserPrompts.map((prompt) => (
                <DropdownMenuItem
                  key={prompt.id}
                  onClick={() => handlePromptSelect(prompt)}
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-zinc-800"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="font-medium text-sm">{prompt.name}</div>
                    {prompt.category && (
                      <Badge variant="outline" className="text-xs">
                        {prompt.category}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-zinc-300 line-clamp-2">{prompt.description}</div>
                  <div className="text-xs text-zinc-400">Model: {prompt.recommendedModelId}</div>
                </DropdownMenuItem>
              ))}
            </>
          )}

          {/* No results */}
          {searchTerm && filteredAdminPrompts.length === 0 && filteredUserPrompts.length === 0 && (
            <div className="p-3 text-center text-zinc-300 text-sm">No prompts found matching "{searchTerm}"</div>
          )}

          {/* Free user message */}
          {userPlan === "free" && userPrompts.length > 0 && (
            <div className="p-3 text-xs text-zinc-300 border-t border-zinc-700">
              Upgrade to access your custom prompts in new chats
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}