"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, BarChart3, Sparkles, Heart, Brain, Zap } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [supabase])

  const features = [
    {
      icon: MessageCircle,
      title: "AI Chat Support",
      description: "Talk to our empathetic AI chatbot trained to understand and support your mental health journey",
    },
    {
      icon: BarChart3,
      title: "Mood Tracking",
      description: "Track your emotional patterns over time with beautiful visualizations and insights",
    },
    {
      icon: Sparkles,
      title: "Self-Care Tools",
      description: "Access guided breathing exercises, wellness tips, and inspirational quotes",
    },
    {
      icon: Heart,
      title: "Personalized Support",
      description: "Get tailored recommendations based on your mood patterns and preferences",
    },
    {
      icon: Brain,
      title: "Mental Wellness",
      description: "Develop healthy coping strategies with our comprehensive wellness resources",
    },
    {
      icon: Zap,
      title: "Crisis Support",
      description: "Quick access to helpline resources and emergency support when you need it most",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">
            Your Personal Mental Health
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Companion
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            SOUL SYNC is an AI-powered mental health chatbot designed to provide compassionate support, mood tracking,
            and self-care tools for your wellness journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/chat">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5" />
                Start Chatting
              </Button>
            </Link>
            {!user && (
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 text-primary hover:bg-primary/10 gap-2 w-full sm:w-auto bg-transparent"
                >
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="border-primary/10 hover:border-primary/30 transition-colors bg-card/50 backdrop-blur"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl">Ready to Start Your Wellness Journey?</CardTitle>
            <CardDescription className="text-base">
              Join thousands of users finding support and peace with SOUL SYNC
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                Chat Now
              </Button>
            </Link>
            {!user && (
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 text-primary hover:bg-primary/10 w-full sm:w-auto bg-transparent"
                >
                  Sign Up Free
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
