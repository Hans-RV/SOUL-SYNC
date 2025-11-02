"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

const WELLNESS_TIPS = [
  {
    title: "Practice Mindfulness",
    description: "Spend 5-10 minutes daily focusing on your breath and present moment awareness.",
  },
  {
    title: "Move Your Body",
    description: "Gentle exercise like walking, yoga, or stretching can improve mood and reduce stress.",
  },
  {
    title: "Connect with Others",
    description: "Reach out to friends or family. Social connection is vital for mental health.",
  },
  {
    title: "Limit Screen Time",
    description: "Take breaks from screens, especially before bed, to reduce anxiety and improve sleep.",
  },
  {
    title: "Practice Gratitude",
    description: "Write down 3 things you're grateful for each day to shift your perspective.",
  },
  {
    title: "Get Quality Sleep",
    description: "Aim for 7-9 hours of sleep. A consistent sleep schedule supports mental wellness.",
  },
  {
    title: "Eat Nourishing Foods",
    description: "Fuel your body with nutritious foods that support brain health and mood.",
  },
  {
    title: "Set Boundaries",
    description: "Learn to say no to protect your energy and mental health.",
  },
]

export function WellnessTips() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Wellness Tips</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {WELLNESS_TIPS.map((tip, index) => (
          <Card
            key={index}
            className="border-primary/10 bg-card/50 backdrop-blur hover:border-primary/30 transition-colors"
          >
            <CardHeader>
              <CardTitle className="text-base">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{tip.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
