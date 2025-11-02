import { BreathingExercise } from "@/components/breathing-exercise"
import { WellnessQuotes } from "@/components/wellness-quotes"
import { WellnessTips } from "@/components/wellness-tips"

export default function SelfCarePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Self-Care Tools</h1>
          <p className="text-muted-foreground">
            Explore guided exercises, inspirational quotes, and wellness tips to support your mental health
          </p>
        </div>

        {/* Main Tools */}
        <div className="grid lg:grid-cols-2 gap-6">
          <BreathingExercise />
          <WellnessQuotes />
        </div>

        {/* Wellness Tips */}
        <div>
          <WellnessTips />
        </div>
      </div>
    </main>
  )
}
