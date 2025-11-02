"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, AlertTriangle, Heart } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { MoodSelector, type MoodOption } from "@/components/mood-selector"
import { ReflectivePrompt } from "@/components/reflective-prompt"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  emotion?: string
  timestamp: Date
}

const CRISIS_KEYWORDS = ["suicide", "kill myself", "harm", "overdose", "end it", "can't take it"]
const CRISIS_RESOURCES = [
  { name: "National Suicide Prevention Lifeline", number: "988", url: "https://988lifeline.org" },
  { name: "Crisis Text Line", number: "Text HOME to 741741", url: "https://www.crisistextline.org" },
  { name: "International Association for Suicide Prevention", url: "https://www.iasp.info/resources/Crisis_Centres/" },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [showMoodSelector, setShowMoodSelector] = useState(true)
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null)
  const [showReflectivePrompt, setShowReflectivePrompt] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    // Load chat history if user is logged in
    const loadChatHistory = async () => {
      if (user) {
        const { data } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .limit(50)

        if (data) {
          setMessages(
            data.map((msg) => ({
              id: msg.id,
              text: msg.message,
              sender: msg.sender_type as "user" | "bot",
              emotion: msg.emotion_detected,
              timestamp: new Date(msg.created_at),
            })),
          )
        }
      }
    }

    loadChatHistory()
  }, [supabase, user])

  useEffect(() => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, shouldAutoScroll])

  useEffect(() => {
    if (messages.length > 0 && !showMoodSelector) {
      const timer = setTimeout(() => {
        setShowReflectivePrompt(true)
      }, 30000)

      return () => clearTimeout(timer)
    }
  }, [messages.length, showMoodSelector])

  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

    setShouldAutoScroll(isNearBottom)
  }

  const detectCrisis = (text: string): boolean => {
    return CRISIS_KEYWORDS.some((keyword) => text.toLowerCase().includes(keyword))
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setShouldAutoScroll(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Check for crisis keywords
    if (detectCrisis(input)) {
      setShowCrisisAlert(true)
    }

    try {
      // Save user message to database if logged in
      if (user) {
        await supabase.from("chat_messages").insert({
          user_id: user.id,
          message: input,
          sender_type: "user",
        })
      }

      // Call Groq API for response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "bot",
        emotion: data.emotion,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])

      // Save bot message to database if logged in
      if (user) {
        await supabase.from("chat_messages").insert({
          user_id: user.id,
          message: data.response,
          sender_type: "bot",
          emotion_detected: data.emotion,
        })
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "I'm having trouble responding right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood)
    setShowMoodSelector(false)

    // Add greeting message from bot
    const greetingMessage: Message = {
      id: Date.now().toString(),
      text: mood.greeting,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages([greetingMessage])
  }

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt)
    setShowReflectivePrompt(false)
  }

  if (showMoodSelector) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Chat with SOUL SYNC</h1>
            <p className="text-muted-foreground">Your compassionate AI mental health companion</p>
          </div>
          <MoodSelector onMoodSelect={handleMoodSelect} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-8">
      <div className="max-w-2xl mx-auto px-4 h-[calc(100vh-8rem)] flex flex-col gap-4">
        {/* Header */}
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold text-primary mb-2">Chat with SOUL SYNC</h1>
          <p className="text-muted-foreground">Your compassionate AI mental health companion</p>
        </div>

        {/* Crisis Alert */}
        {showCrisisAlert && (
          <Alert className="border-destructive/50 bg-destructive/10 flex-shrink-0">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              <div className="font-semibold mb-2">If you're in crisis, please reach out:</div>
              <div className="space-y-1 text-sm">
                {CRISIS_RESOURCES.map((resource, idx) => (
                  <div key={idx}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:no-underline"
                    >
                      {resource.name}
                    </a>
                    {resource.number && <span> - {resource.number}</span>}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {showReflectivePrompt && !showCrisisAlert && (
          <div className="flex-shrink-0">
            <ReflectivePrompt onPromptSelect={handlePromptSelect} />
          </div>
        )}

        <Card className="flex-1 min-h-0 border-primary/10 bg-card/50 backdrop-blur overflow-hidden">
          <div ref={scrollContainerRef} onScroll={handleScroll} className="h-full overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Welcome to SOUL SYNC</h2>
                  <p className="text-muted-foreground max-w-sm">
                    I'm here to listen and support you. Share what's on your mind, and let's talk about it together.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-secondary/20 text-foreground rounded-bl-none border border-secondary/30"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      {message.emotion && (
                        <p className="text-xs mt-2 opacity-70">Detected emotion: {message.emotion}</p>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary/20 text-foreground px-4 py-3 rounded-2xl rounded-bl-none border border-secondary/30">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" />
                        <div
                          className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </Card>

        <form onSubmit={handleSendMessage} className="flex gap-2 flex-shrink-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            disabled={loading}
            className="flex-1 border-primary/20 focus:border-primary bg-card/50 backdrop-blur"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>

        {!user && (
          <p className="text-center text-xs text-muted-foreground flex-shrink-0">
            Chat history is saved only for logged-in users.{" "}
            <a href="/auth/sign-up" className="text-primary hover:underline">
              Sign up
            </a>{" "}
            to save your conversations.
          </p>
        )}
      </div>
    </main>
  )
}
