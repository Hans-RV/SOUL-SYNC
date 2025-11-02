"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, X } from "lucide-react"

const REFLECTIVE_PROMPTS = [
  "What's one thing that made you smile today?",
  "If your mind had a color right now, what would it be?",
  "What are you grateful for in this moment?",
  "How would you describe your energy level today?",
  "What's one small act of kindness you could do for yourself?",
  "If you could tell your past self one thing, what would it be?",
  "What does peace feel like to you right now?",
  "What's one thing you're looking forward to?",
  "How are you being gentle with yourself today?",
  "What would make today feel complete for you?",
]

interface ReflectivePromptProps {
  onPromptSelect: (prompt: string) => void
}

export function ReflectivePrompt({ onPromptSelect }: ReflectivePromptProps) {
  const [prompt, setPrompt] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show prompt after 30 seconds of idle time
    const timer = setTimeout(() => {
      const randomPrompt = REFLECTIVE_PROMPTS[Math.floor(Math.random() * REFLECTIVE_PROMPTS.length)]
      setPrompt(randomPrompt)
      setIsVisible(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground mb-1">Reflective Moment</p>
          <p className="text-sm text-muted-foreground mb-3">{prompt}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                onPromptSelect(prompt)
                setIsVisible(false)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Reflect on this
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsVisible(false)} className="hover:bg-primary/10">
              Maybe later
            </Button>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 hover:bg-primary/10 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
