import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BrainCircuit,
  Key,
  Globe,
  Database,
  Zap,
  Crown,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface AIModel {
  id: string
  name: string
  provider: string
  isPro?: boolean
  supportsCustomKey?: boolean
  contextLimit?: string
  pricing?: string
  capabilities?: string[]
  description?: string
}

const availableModels: AIModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    contextLimit: "128K tokens",
    capabilities: ["Text", "Vision", "Code"],
    description: "Fast and efficient model for everyday tasks"
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    isPro: true,
    contextLimit: "128K tokens",
    capabilities: ["Text", "Vision", "Code", "Advanced Reasoning"],
    description: "Most capable OpenAI model with multimodal abilities"
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    contextLimit: "200K tokens",
    capabilities: ["Text", "Code", "Fast Response"],
    description: "Fastest Claude model for quick tasks"
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    isPro: true,
    contextLimit: "200K tokens",
    capabilities: ["Text", "Vision", "Code", "Analysis"],
    description: "Balanced performance and intelligence"
  },
  {
    id: "openrouter/gemini-flash",
    name: "Gemini Flash",
    provider: "OpenRouter",
    supportsCustomKey: true,
    contextLimit: "1M tokens",
    capabilities: ["Text", "Vision", "Code", "Large Context"],
    description: "Google's fast multimodal model via OpenRouter"
  },
  {
    id: "openrouter/mistral-large",
    name: "Mistral Large",
    provider: "OpenRouter",
    isPro: true,
    supportsCustomKey: true,
    contextLimit: "128K tokens",
    capabilities: ["Text", "Code", "Multilingual"],
    description: "Mistral's most capable model via OpenRouter"
  },
]

interface EnhancedModelSelectorProps {
  selectedModelId: string
  onModelChange: (modelId: string) => void
  userPlan?: "free" | "plus" | "pro"
  customApiKeys?: Record<string, string>
  onApiKeyChange?: (modelId: string, apiKey: string) => void
  variant?: "desktop" | "mobile"
}

export function EnhancedModelSelector({
  selectedModelId,
  onModelChange,
  userPlan = "free",
  customApiKeys = {},
  onApiKeyChange,
  variant = "desktop"
}: EnhancedModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"models" | "extensions">("models")
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)

  const selectedModel = availableModels.find(m => m.id === selectedModelId)
  const hasCustomKey = selectedModel?.supportsCustomKey && customApiKeys[selectedModelId]
  const isPro = userPlan === "pro" || userPlan === "plus"

  const handleModelSelect = (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId)
    if (!model || (model.isPro && !isPro)) return

    onModelChange(modelId)
    setIsOpen(false)
  }

  const handleApiKeyChange = (modelId: string, value: string) => {
    onApiKeyChange?.(modelId, value)
  }

  // Mobile variant renders a simple list without popover
  if (variant === "mobile") {
    return (
      <div className="space-y-4">
        <div className="flex border-b border-zinc-700">
          <button
            onClick={() => setActiveTab("models")}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "models"
                ? "text-teal-400 border-b-2 border-teal-400 bg-zinc-800/50"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Models
          </button>
          <button
            onClick={() => setActiveTab("extensions")}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "extensions"
                ? "text-teal-400 border-b-2 border-teal-400 bg-zinc-800/50"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Extensions
          </button>
        </div>

        <ScrollArea className="max-h-[400px]">
          {activeTab === "models" && (
            <div className="space-y-3">
              {availableModels.map((model) => (
                <div
                  key={model.id}
                  className={cn(
                    "relative p-3 rounded-lg border transition-all duration-200",
                    selectedModelId === model.id
                      ? "border-teal-500 bg-teal-500/10"
                      : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50",
                    model.isPro && !isPro ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  )}
                  onClick={() => handleModelSelect(model.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{model.name}</span>
                        {model.isPro && <Crown className="h-3 w-3 text-amber-400" />}
                        {model.supportsCustomKey && <Key className="h-3 w-3 text-zinc-400" />}
                        {selectedModelId === model.id && <Check className="h-4 w-4 text-teal-400" />}
                      </div>
                      <p className="text-xs text-zinc-400 mb-2">{model.provider}</p>
                      <p className="text-xs text-zinc-300 mb-2">{model.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {model.capabilities?.map((cap) => (
                          <Badge key={cap} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-zinc-400">
                        <div>Context: {model.contextLimit}</div>
                      </div>
                    </div>
                  </div>

                  {model.supportsCustomKey && selectedModelId === model.id && (
                    <div className="mt-3 pt-3 border-t border-zinc-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="h-3 w-3 text-amber-400" />
                        <span className="text-xs font-medium text-zinc-300">Custom API Key</span>
                      </div>
                      <Input
                        type="password"
                        placeholder="Enter your API key..."
                        value={customApiKeys[model.id] || ""}
                        onChange={(e) => handleApiKeyChange(model.id, e.target.value)}
                        className="h-8 text-xs bg-zinc-800 border-zinc-600"
                      />
                    </div>
                  )}

                  {model.isPro && !isPro && (
                    <div className="absolute bottom-2 right-2">
                      <div className="text-xs text-zinc-500 bg-zinc-800/90 px-2 py-1 rounded">
                        Upgrade to access
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "extensions" && (
            <div className="space-y-3">
              <div className={cn(
                "relative p-3 rounded-lg border border-zinc-700",
                !isPro && "opacity-50"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="font-medium text-white text-sm">Realtime Web Search</p>
                      <p className="text-xs text-zinc-400">Search the web for current information</p>
                    </div>
                    <Crown className="h-3 w-3 text-amber-400" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!isPro}
                    className="h-8 px-3 text-xs"
                  >
                    Enable
                  </Button>
                </div>
                {!isPro && (
                  <div className="absolute bottom-2 right-2">
                    <div className="text-xs text-zinc-500 bg-zinc-800/90 px-2 py-1 rounded">
                      Upgrade to access
                    </div>
                  </div>
                )}
              </div>

              <div className={cn(
                "relative p-3 rounded-lg border border-zinc-700",
                !isPro && "opacity-50"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-400" />
                    <div>
                      <p className="font-medium text-white text-sm">RAG</p>
                      <p className="text-xs text-zinc-400">Use your uploaded documents</p>
                    </div>
                    <Crown className="h-3 w-3 text-amber-400" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!isPro}
                    className="h-8 px-3 text-xs"
                  >
                    Enable
                  </Button>
                </div>
                {!isPro && (
                  <div className="absolute bottom-2 right-2">
                    <div className="text-xs text-zinc-500 bg-zinc-800/90 px-2 py-1 rounded">
                      Upgrade to access
                    </div>
                  </div>
                )}
              </div>

              <div className={cn(
                "relative p-3 rounded-lg border border-zinc-700",
                !isPro && "opacity-50"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <div>
                      <p className="font-medium text-white text-sm">MCP</p>
                      <p className="text-xs text-zinc-400">Connect to external tools</p>
                    </div>
                    <Crown className="h-3 w-3 text-amber-400" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!isPro}
                    className="h-8 px-3 text-xs"
                  >
                    Enable
                  </Button>
                </div>
                {!isPro && (
                  <div className="absolute bottom-2 right-2">
                    <div className="text-xs text-zinc-500 bg-zinc-800/90 px-2 py-1 rounded">
                      Upgrade to access
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasCustomKey ? "outline" : "ghost"}
          className={cn(
            "h-10 px-3 gap-2 text-sm font-medium transition-all duration-200",
            hasCustomKey && "border-teal-500/50 text-teal-400 hover:border-teal-400"
          )}
        >
          <BrainCircuit className="h-4 w-4 text-teal-400" />
          <span className="hidden sm:inline">{selectedModel?.name || "Select Model"}</span>
          {hasCustomKey && <Key className="h-3 w-3 text-amber-400 ml-1" />}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[calc(100vw-2rem)] md:w-[480px] p-0 bg-zinc-900 border-zinc-700"
        align="center"
        side="top"
        sideOffset={8}
      >
        <div className="flex flex-col h-[70vh] md:h-[500px] max-h-[500px]">
          <div className="flex border-b border-zinc-700">
            <button
              onClick={() => setActiveTab("models")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === "models"
                  ? "text-teal-400 border-b-2 border-teal-400 bg-zinc-800/50"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Models
            </button>
            <button
              onClick={() => setActiveTab("extensions")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === "extensions"
                  ? "text-teal-400 border-b-2 border-teal-400 bg-zinc-800/50"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Extensions
            </button>
          </div>

          <ScrollArea className="flex-1 overflow-hidden">
            {activeTab === "models" && (
              <div className="p-4 space-y-3 min-h-0">
                {availableModels.map((model) => (
                  <div
                    key={model.id}
                    className={cn(
                      "relative p-3 rounded-lg border transition-all duration-200",
                      selectedModelId === model.id
                        ? "border-teal-500 bg-teal-500/10"
                        : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50",
                      model.isPro && !isPro ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    )}
                    onClick={() => handleModelSelect(model.id)}
                    onMouseEnter={() => setHoveredModel(model.id)}
                    onMouseLeave={() => setHoveredModel(null)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{model.name}</span>
                          {model.isPro && <Crown className="h-3 w-3 text-amber-400" />}
                          {model.supportsCustomKey && <Key className="h-3 w-3 text-zinc-400" />}
                          {selectedModelId === model.id && <Check className="h-4 w-4 text-teal-400" />}
                        </div>
                        <p className="text-xs text-zinc-400 mb-2">{model.provider}</p>

                        {hoveredModel === model.id && (
                          <div className="space-y-2">
                            <p className="text-xs text-zinc-300">{model.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {model.capabilities?.map((cap) => (
                                <Badge key={cap} variant="secondary" className="text-xs">
                                  {cap}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-xs text-zinc-400">
                              <div>Context: {model.contextLimit}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {model.supportsCustomKey && selectedModelId === model.id && (
                      <div className="mt-3 pt-3 border-t border-zinc-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Key className="h-3 w-3 text-amber-400" />
                          <span className="text-xs font-medium text-zinc-300">Custom API Key</span>
                        </div>
                        <Input
                          type="password"
                          placeholder="Enter your API key..."
                          value={customApiKeys[model.id] || ""}
                          onChange={(e) => handleApiKeyChange(model.id, e.target.value)}
                          className="h-8 text-xs bg-zinc-800 border-zinc-600"
                        />
                      </div>
                    )}

                    {model.isPro && !isPro && (
                      <div className="absolute bottom-2 right-2">
                        <div className="text-xs text-zinc-500 bg-zinc-800/90 px-2 py-1 rounded">
                          Upgrade to access
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "extensions" && (
              <div className="p-4 space-y-3 min-h-0">
                <div className={cn(
                  "relative p-3 rounded-lg border border-zinc-700",
                  !isPro && "opacity-50"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="font-medium text-white text-sm">Realtime Web Search</p>
                        <p className="text-xs text-zinc-400">Search the web for current information</p>
                      </div>
                      <Crown className="h-3 w-3 text-amber-400" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!isPro}
                      className="h-8 px-3 text-xs"
                    >
                      Enable
                    </Button>
                  </div>
                  {!isPro && (
                    <div className="absolute bottom-2 right-2">
                      <div className="text-xs text-zinc-500 bg-zinc-800/90 px-2 py-1 rounded">
                        Upgrade to access
                      </div>
                    </div>
                  )}
                </div>

                <div className={cn(
                  "relative p-3 rounded-lg border border-zinc-700",
                  !isPro && "opacity-50"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-purple-400" />
                      <div>
                        <p className="font-medium text-white text-sm">RAG</p>
                        <p className="text-xs text-zinc-400">Use your uploaded documents</p>
                      </div>
                      <Crown className="h-3 w-3 text-amber-400" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!isPro}
                      className="h-8 px-3 text-xs"
                    >
                      Enable
                    </Button>
                  </div>
                  {!isPro && (
                    <div className="absolute bottom-2 right-2">
                      <div className="text-xs text-zinc-500 bg-zinc-800/90 px-2 py-1 rounded">
                        Upgrade to access
                      </div>
                    </div>
                  )}
                </div>

                <div className={cn(
                  "relative p-3 rounded-lg border border-zinc-700",
                  !isPro && "opacity-50"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <div>
                        <p className="font-medium text-white text-sm">MCP</p>
                        <p className="text-xs text-zinc-400">Connect to external tools</p>
                      </div>
                      <Crown className="h-3 w-3 text-amber-400" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!isPro}
                      className="h-8 px-3 text-xs"
                    >
                      Enable
                    </Button>
                  </div>
                  {!isPro && (
                    <div className="absolute bottom-2 right-2">
                      <div className="text-xs text-zinc-500 bg-zinc-800/90 px-2 py-1 rounded">
                        Upgrade to access
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}