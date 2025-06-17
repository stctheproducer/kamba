"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BrainCircuit } from "lucide-react"

export interface AIModel {
  id: string
  name: string
  provider: string
  isPro?: boolean
}

const availableModels: AIModel[] = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", isPro: true },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic", isPro: true },
  { id: "openrouter/gemini-flash", name: "Gemini Flash (OpenRouter)", provider: "OpenRouter" },
  { id: "openrouter/mistral-large", name: "Mistral Large (OpenRouter)", provider: "OpenRouter", isPro: true },
]

export function ModelSelector({
  selectedModelId,
  onModelChange,
  userPlan = "free", // 'free', 'plus', 'pro'
}: {
  selectedModelId: string
  onModelChange: (modelId: string) => void
  userPlan?: string
}) {
  const accessibleModels = availableModels.filter((model) => !model.isPro || userPlan === "pro" || userPlan === "plus")

  return (
    <Select value={selectedModelId} onValueChange={onModelChange}>
      <SelectTrigger className="w-auto min-w-[200px] bg-zinc-800 border-zinc-700 h-9 text-sm">
        <BrainCircuit className="h-4 w-4 mr-2 text-primary" />
        <SelectValue placeholder="Select AI Model" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-700">
        {accessibleModels.map((model) => (
          <SelectItem key={model.id} value={model.id} className="focus:bg-primary/50">
            <div className="flex justify-between items-center w-full">
              <span>{model.name}</span>
              <span className="text-xs text-zinc-500 ml-2">{model.provider}</span>
            </div>
          </SelectItem>
        ))}
        {availableModels.some((m) => m.isPro && userPlan !== "pro" && userPlan !== "plus") && (
          <div className="p-2 text-xs text-zinc-400 text-center border-t border-zinc-700 mt-1">
            Upgrade to Pro for more models.
          </div>
        )}
      </SelectContent>
    </Select>
  )
}