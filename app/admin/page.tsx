"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Trash2, Plus, BarChart3 } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface AdminResponse {
  id: string
  trigger_keyword: string
  response_text: string
  emotion_category: string
  created_at: string
}

interface ChatStats {
  totalMessages: number
  userMessages: number
  botMessages: number
  averageEmotionScore: number
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [responses, setResponses] = useState<AdminResponse[]>([])
  const [stats, setStats] = useState<ChatStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form state
  const [keyword, setKeyword] = useState("")
  const [responseText, setResponseText] = useState("")
  const [emotionCategory, setEmotionCategory] = useState("general")

  const router = useRouter()
  const supabase = createClient()

  const EMOTION_CATEGORIES = ["general", "anxiety", "depression", "stress", "grief", "anger", "loneliness"]

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      await loadResponses(user.id)
      await loadStats()
    }

    checkAdmin()
  }, [supabase, router])

  const loadResponses = async (userId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("admin_responses")
        .select("*")
        .eq("admin_id", userId)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError
      setResponses(data || [])
    } catch (err) {
      console.error("Error loading responses:", err)
      setError("Failed to load responses")
    }
  }

  const loadStats = async () => {
    try {
      const { data, error: fetchError } = await supabase.from("chat_messages").select("*")

      if (fetchError) throw fetchError

      const totalMessages = data?.length || 0
      const userMessages = data?.filter((m) => m.sender_type === "user").length || 0
      const botMessages = data?.filter((m) => m.sender_type === "bot").length || 0

      setStats({
        totalMessages,
        userMessages,
        botMessages,
        averageEmotionScore: 0,
      })
    } catch (err) {
      console.error("Error loading stats:", err)
    }
  }

  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !keyword.trim() || !responseText.trim()) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error: insertError } = await supabase.from("admin_responses").insert({
        admin_id: user.id,
        trigger_keyword: keyword.toLowerCase(),
        response_text: responseText,
        emotion_category: emotionCategory,
      })

      if (insertError) throw insertError

      setKeyword("")
      setResponseText("")
      setEmotionCategory("general")
      setSuccess("Response added successfully!")

      await loadResponses(user.id)

      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error adding response:", err)
      setError("Failed to add response")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteResponse = async (id: string) => {
    if (!user) return

    try {
      const { error: deleteError } = await supabase.from("admin_responses").delete().eq("id", id)

      if (deleteError) throw deleteError

      await loadResponses(user.id)
      setSuccess("Response deleted successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error deleting response:", err)
      setError("Failed to delete response")
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please sign in to access the admin panel.</AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage chatbot responses and view analytics</p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-primary/10 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Messages</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalMessages}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">User Messages</p>
                  <p className="text-3xl font-bold text-secondary">{stats.userMessages}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Bot Messages</p>
                  <p className="text-3xl font-bold text-accent">{stats.botMessages}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Responses</p>
                  <p className="text-3xl font-bold text-primary">{responses.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add Response Form */}
          <Card className="border-primary/10 bg-card/50 backdrop-blur lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add Response
              </CardTitle>
              <CardDescription>Create a new chatbot response</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddResponse} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="keyword" className="text-foreground">
                    Trigger Keyword
                  </Label>
                  <Input
                    id="keyword"
                    placeholder="e.g., anxiety, stress"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="border-primary/20 focus:border-primary bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emotion" className="text-foreground">
                    Emotion Category
                  </Label>
                  <select
                    id="emotion"
                    value={emotionCategory}
                    onChange={(e) => setEmotionCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-background/50 text-foreground focus:border-primary focus:outline-none"
                  >
                    {EMOTION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="response" className="text-foreground">
                    Response Text
                  </Label>
                  <Textarea
                    id="response"
                    placeholder="Enter the chatbot response..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="border-primary/20 focus:border-primary bg-background/50 min-h-24"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? "Adding..." : "Add Response"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Responses List */}
          <Card className="border-primary/10 bg-card/50 backdrop-blur lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Chatbot Responses
              </CardTitle>
              <CardDescription>Manage custom responses for different emotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {responses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No responses yet. Add one to get started!</p>
                ) : (
                  responses.map((response) => (
                    <div
                      key={response.id}
                      className="p-4 rounded-lg bg-background/50 border border-border/50 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">{response.trigger_keyword}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {response.emotion_category}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{response.response_text}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(response.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteResponse(response.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
