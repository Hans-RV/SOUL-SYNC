"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Quote, RefreshCw } from "lucide-react"

const WELLNESS_QUOTES = [
  "You are stronger than you think. Every challenge you overcome makes you more resilient.",
  "Progress, not perfection. Small steps forward are still steps in the right direction.",
  "Your mental health is a priority, not a luxury. Take care of yourself.",
  "It's okay to not be okay. What matters is that you're reaching out and seeking support.",
  "You deserve kindness, especially from yourself. Practice self-compassion today.",
  "Healing is not linear. Be patient and gentle with yourself on difficult days.",
  "Your feelings are valid. Allow yourself to feel without judgment.",
  "You are not alone in this. Many people understand what you're going through.",
  "Taking a break is not giving up. Rest is part of the journey to wellness.",
  "You have survived 100% of your worst days. You are capable of getting through this.",
  "Anxiety is just a feeling, not a fact. This moment will pass.",
  "Your worth is not determined by your productivity. You are enough as you are.",
  "Asking for help is a sign of strength, not weakness.",
  "Every day is a new opportunity to take care of yourself.",
  "You are doing better than you think. Give yourself credit for trying.",
]

export function WellnessQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0)

  const getNewQuote = () => {
    setCurrentQuote(Math.floor(Math.random() * WELLNESS_QUOTES.length))
  }

  return (
    <Card className="border-primary/10 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-primary" />
          Daily Inspiration
        </CardTitle>
        <CardDescription>A moment of reflection for your wellness</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20 min-h-32 flex items-center justify-center">
          <p className="text-lg text-foreground text-center italic leading-relaxed">
            "{WELLNESS_QUOTES[currentQuote]}"
          </p>
        </div>

        <Button
          onClick={getNewQuote}
          variant="outline"
          className="w-full border-primary/20 text-primary hover:bg-primary/10 gap-2 bg-transparent"
        >
          <RefreshCw className="w-4 h-4" />
          Get Another Quote
        </Button>
      </CardContent>
    </Card>
  )
}
