"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Frown, Meh, Zap, Sparkles } from "lucide-react"

export interface MoodOption {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  greeting: string
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "calm",
    label: "Calm",
    icon: <Smile className="w-6 h-6" />,
    color: "text-green-500",
    greeting: "It's wonderful that you're feeling calm. Let's maintain this peaceful state together.",
  },
  {
    id: "sad",
    label: "Sad",
    icon: <Frown className="w-6 h-6" />,
    color: "text-blue-500",
    greeting: "I'm here for you. It's okay to feel sad. Let's talk about what's on your mind.",
  },
  {
    id: "stressed",
    label: "Stressed",
    icon: <Zap className="w-6 h-6" />,
    color: "text-orange-500",
    greeting: "I understand you're feeling stressed. Let's start with a deep breath together. Inhale... and exhale...",
  },
  {
    id: "numb",
    label: "Numb",
    icon: <Meh className="w-6 h-6" />,
    color: "text-gray-500",
    greeting: "Feeling numb can be difficult. I'm here to help you reconnect with your emotions, one step at a time.",
  },
  {
    id: "reflective",
    label: "Reflective",
    icon: <Sparkles className="w-6 h-6" />,
    color: "text-purple-500",
    greeting: "A reflective mood is a gift. Let's explore your thoughts and feelings together.",
  },
]

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodOption) => void
}

export function MoodSelector({ onMoodSelect }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  const handleSelect = (mood: MoodOption) => {
    setSelectedMood(mood.id)
    setTimeout(() => {
      onMoodSelect(mood)
    }, 300)
  }

  return (
    <Card className="p-8 border-primary/10 bg-card/50 backdrop-blur">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">How are you feeling today?</h2>
        <p className="text-muted-foreground">Select your current mood to help me understand you better</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleSelect(mood)}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
              selectedMood === mood.id
                ? "border-primary bg-primary/10 scale-105"
                : "border-border bg-background hover:border-primary/50"
            }`}
          >
            <div className={mood.color}>{mood.icon}</div>
            <span className="text-sm font-medium text-foreground">{mood.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          onClick={() => onMoodSelect(MOOD_OPTIONS[0])}
          className="text-muted-foreground hover:text-primary"
        >
          Skip for now
        </Button>
      </div>
    </Card>
  )
}
