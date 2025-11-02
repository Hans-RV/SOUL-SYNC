"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            setError(exchangeError.message)
            setLoading(false)
            return
          }
        }

        router.push("/chat")
      } catch (err) {
        setError("An error occurred during email confirmation")
        setLoading(false)
      }
    }

    handleCallback()
  }, [searchParams, supabase, router])

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-center text-primary">
          {loading ? "Confirming Email" : "Confirmation Error"}
        </CardTitle>
        <CardDescription className="text-center">
          {loading ? "Please wait while we confirm your email..." : "There was an issue confirming your email"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
