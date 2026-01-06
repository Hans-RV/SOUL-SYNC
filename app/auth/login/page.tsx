"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { User, Chrome } from "lucide-react"

function LoginContent() {
  const [error, setError] = useState("")
  const [googleLoading, setGoogleLoading] = useState(false)
  const [buttonRendered, setButtonRendered] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, signInWithGoogle, signInAsGuest } = useAuth()
  
  // Get return URL from query params, default to /chat
  const returnUrl = searchParams.get("returnUrl") || "/chat"

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(returnUrl)
    }
  }, [user, router, returnUrl])

  // Initialize Google Sign-In button
  useEffect(() => {
    if (user || buttonRendered) return

    const initGoogleButton = () => {
      // @ts-expect-error - google is loaded from script
      if (window.google?.accounts?.id) {
        signInWithGoogle()
          .then(() => setButtonRendered(true))
          .catch((err) => {
            console.error("Failed to initialize Google Sign-In:", err)
          })
      }
    }

    // Try immediately in case script is already loaded
    initGoogleButton()

    // Also set up an interval to retry (in case script loads later)
    const interval = setInterval(() => {
      // @ts-expect-error - google is loaded from script
      if (window.google?.accounts?.id && !buttonRendered) {
        initGoogleButton()
        clearInterval(interval)
      }
    }, 100)

    // Clean up after 5 seconds
    const timeout = setTimeout(() => clearInterval(interval), 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [user, buttonRendered, signInWithGoogle])

  // Reset button rendered state when user logs out
  useEffect(() => {
    if (!user) {
      setButtonRendered(false)
    }
  }, [user])

  const handleGoogleSignIn = async () => {
    setError("")
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      router.push(returnUrl)
    } catch (err: any) {
      console.error("Google Sign-In Error:", err)
      setError(err?.message || "Failed to sign in with Google. Please try Guest login instead.")
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGuestSignIn = () => {
    signInAsGuest()
    router.push(returnUrl)
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
      />
      
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center text-primary">Welcome to SOUL SYNC</CardTitle>
          <CardDescription className="text-center">
            Choose how you'd like to continue your wellness journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Google Sign In */}
          <div id="google-signin-button" className="w-full flex justify-center" />
          
          {error && error.includes("Google") && (
            <p className="text-xs text-center text-muted-foreground">
              Having trouble? Try the Guest login below
            </p>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Guest Sign In */}
          <Button
            onClick={handleGuestSignIn}
            variant="secondary"
            className="w-full gap-3 h-12"
          >
            <User className="w-5 h-5" />
            Continue as Guest
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Guest sessions are temporary and your chat history won't be saved.
            Sign in with Google for a personalized experience.
          </p>

          <div className="mt-6 pt-4 border-t border-border">
            <Link href="/" className="text-center block text-sm text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
