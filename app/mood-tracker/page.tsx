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
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar, TrendingUp, Heart, AlertCircle, Flame, Award } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface MoodEntry {
  id: string
  mood_score: number
  mood_label: string
  notes: string
  created_at: string
}

const MOOD_LABELS = ["Terrible", "Bad", "Okay", "Good", "Great"]
const MOOD_COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"]

export default function MoodTrackerPage() {
  const [user, setUser] = useState<User | null>(null)
  const [moodScore, setMoodScore] = useState(5)
  const [notes, setNotes] = useState("")
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [streak, setStreak] = useState(0)
  const [totalDays, setTotalDays] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      await loadMoodEntries(user.id)
    }

    getUser()
  }, [supabase, router])

  const calculateStreak = (entries: MoodEntry[]) => {
    if (entries.length === 0) return 0

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

    let currentStreak = 0
    let lastDate = new Date()
    lastDate.setHours(0, 0, 0, 0)

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.created_at)
      entryDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((lastDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0 || diffDays === 1) {
        currentStreak++
        lastDate = entryDate
      } else {
        break
      }
    }

    return currentStreak
  }

  const calculateTotalDays = (entries: MoodEntry[]) => {
    const uniqueDates = new Set(
      entries.map((entry) => {
        const date = new Date(entry.created_at)
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      }),
    )
    return uniqueDates.size
  }

  const loadMoodEntries = async (userId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })

      if (fetchError) throw fetchError

      const entriesWithLabels = data.map((entry) => ({
        ...entry,
        mood_label: MOOD_LABELS[entry.mood_score - 1] || "Unknown",
      }))

      setEntries(entriesWithLabels)
      setStreak(calculateStreak(entriesWithLabels))
      setTotalDays(calculateTotalDays(entriesWithLabels))
    } catch (err) {
      console.error("Error loading mood entries:", err)
      setError("Failed to load mood history")
    }
  }

  const handleAddMood = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")

    try {
      const { error: insertError } = await supabase.from("mood_entries").insert({
        user_id: user.id,
        mood_score: moodScore,
        mood_label: MOOD_LABELS[moodScore - 1],
        notes: notes || null,
      })

      if (insertError) throw insertError

      setNotes("")
      setMoodScore(5)
      await loadMoodEntries(user.id)
    } catch (err) {
      console.error("Error adding mood:", err)
      setError("Failed to save mood entry")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please sign in to use the mood tracker.</AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  // Prepare chart data
  const chartData = entries.slice(-30).map((entry) => ({
    date: new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: entry.mood_score,
    label: entry.mood_label,
  }))

  // Calculate statistics
  const avgMood =
    entries.length > 0 ? (entries.reduce((sum, e) => sum + e.mood_score, 0) / entries.length).toFixed(1) : 0
  const bestMood = entries.length > 0 ? Math.max(...entries.map((e) => e.mood_score)) : 0
  const worstMood = entries.length > 0 ? Math.min(...entries.map((e) => e.mood_score)) : 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Mood Tracker</h1>
          <p className="text-muted-foreground">
            Track your emotional patterns and discover insights about your wellness
          </p>
        </div>

        {entries.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-primary/10 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                    <p className="text-3xl font-bold text-foreground">{streak} days</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {streak > 0 ? "Keep it going!" : "Start your journey today"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mindful Days</p>
                    <p className="text-3xl font-bold text-foreground">{totalDays}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You've spent {totalDays} mindful {totalDays === 1 ? "day" : "days"} with SOUL SYNC
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add Mood Form */}
          <Card className="border-primary/10 bg-card/50 backdrop-blur lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                How are you feeling?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMood} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Label className="text-foreground">Mood Level</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setMoodScore(score)}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                          moodScore === score
                            ? "ring-2 ring-primary scale-105"
                            : "hover:scale-105 opacity-60 hover:opacity-100"
                        }`}
                        style={{
                          backgroundColor: MOOD_COLORS[score - 1],
                          color: "white",
                        }}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground text-center">{MOOD_LABELS[moodScore - 1]}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-foreground">
                    Notes (optional)
                  </Label>
                  <Input
                    id="notes"
                    placeholder="What's on your mind?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border-primary/20 focus:border-primary bg-background/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? "Saving..." : "Save Mood"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-primary/10 bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Average Mood</p>
                    <p className="text-3xl font-bold text-primary">{avgMood}</p>
                    <p className="text-xs text-muted-foreground mt-1">/5</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Best Mood</p>
                    <p className="text-3xl font-bold text-green-500">{bestMood}</p>
                    <p className="text-xs text-muted-foreground mt-1">{MOOD_LABELS[bestMood - 1]}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Entries</p>
                    <p className="text-3xl font-bold text-secondary">{entries.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">tracked</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Charts */}
        {entries.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-primary/10 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Mood Trend
                </CardTitle>
                <CardDescription>Your mood over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                    <YAxis domain={[1, 5]} stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "var(--foreground)" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--primary)"
                      dot={{ fill: "var(--primary)" }}
                      name="Mood Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Mood Distribution
                </CardTitle>
                <CardDescription>How often you feel each way</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      {
                        name: "Terrible",
                        count: entries.filter((e) => e.mood_score === 1).length,
                      },
                      {
                        name: "Bad",
                        count: entries.filter((e) => e.mood_score === 2).length,
                      },
                      {
                        name: "Okay",
                        count: entries.filter((e) => e.mood_score === 3).length,
                      },
                      {
                        name: "Good",
                        count: entries.filter((e) => e.mood_score === 4).length,
                      },
                      {
                        name: "Great",
                        count: entries.filter((e) => e.mood_score === 5).length,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "var(--foreground)" }}
                    />
                    <Bar dataKey="count" fill="var(--secondary)" name="Frequency" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Entries */}
        {entries.length > 0 && (
          <Card className="border-primary/10 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>Your latest mood logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[...entries].reverse().map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 p-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ backgroundColor: MOOD_COLORS[entry.mood_score - 1] }}
                    >
                      {entry.mood_score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{entry.mood_label}</p>
                      {entry.notes && <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(entry.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {entries.length === 0 && (
          <Card className="border-primary/10 bg-card/50 backdrop-blur text-center py-12">
            <CardContent>
              <Heart className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Start tracking your mood to see insights and patterns</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
