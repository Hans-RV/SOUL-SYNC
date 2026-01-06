"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind } from "lucide-react"

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [count, setCount] = useState(0)
  const [cycle, setCycle] = useState(1)

  const phases = {
    inhale: { duration: 4, label: "Breathe In", color: "from-primary to-secondary" },
    hold: { duration: 4, label: "Hold", color: "from-secondary to-accent" },
    exhale: { duration: 4, label: "Breathe Out", color: "from-accent to-primary" },
  }

  const startExercise = () => {
    setIsActive(true)
    setPhase("inhale")
    setCount(4)
    setCycle(1)

    let currentPhase: "inhale" | "hold" | "exhale" = "inhale"
    let currentCount = 4
    let cycleCount = 1

    const interval = setInterval(() => {
      currentCount--

      if (currentCount <= 0) {
        if (currentPhase === "inhale") {
          currentPhase = "hold"
          currentCount = 4
        } else if (currentPhase === "hold") {
          currentPhase = "exhale"
          currentCount = 4
        } else {
          cycleCount++

          if (cycleCount > 5) {
            clearInterval(interval)
            setIsActive(false)
            setPhase("inhale")
            setCount(0)
            setCycle(1)
            return
          }

          currentPhase = "inhale"
          currentCount = 4
          setCycle(cycleCount)
        }

        setPhase(currentPhase)
      }

      setCount(currentCount)
    }, 1000)
  }

  const currentPhaseData = phases[phase]

  return (
    <Card className="border-primary/10 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-primary" />
          Guided Breathing
        </CardTitle>
        <CardDescription>4-4-4 breathing exercise to calm your mind</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-br ${currentPhaseData.color} flex items-center justify-center transition-all duration-1000 ${
              isActive ? "scale-100" : "scale-75"
            }`}
            style={{
              opacity: isActive ? 0.5 + (count / 4) * 0.5 : 0.5,
            }}
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{currentPhaseData.label}</p>
              <p className="text-2xl font-bold text-foreground">{isActive ? count : 4}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isActive ? `Cycle ${cycle} of 5` : "Ready to begin?"}
            </p>
          </div>
        </div>

        <Button
          onClick={startExercise}
          disabled={isActive}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isActive ? "Breathing..." : "Start Exercise"}
        </Button>
      </CardContent>
    </Card>
  )
}
