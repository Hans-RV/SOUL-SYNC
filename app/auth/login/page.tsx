"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { User, Loader2 } from "lucide-react"

function LoginContent() {
  const [error, setError] = useState("")
  const [googleLoading, setGoogleLoading] = useState(true)
  const [buttonRendered, setButtonRendered] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const buttonContainerRef = useRef<HTMLDivElement>(null)
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
    if (user || buttonRendered || !scriptLoaded) return

    const initGoogleButton = () => {
      // @ts-expect-error - google is loaded from script
      if (window.google?.accounts?.id) {
        signInWithGoogle()
          .then(() => {
            setButtonRendered(true)
            setGoogleLoading(false)
          })
          .catch((err) => {
            console.error("Failed to initialize Google Sign-In:", err)
            setGoogleLoading(false)
          })
      }
    }

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(initGoogleButton, 100)

    // Also set up an interval to retry (in case script loads later)
    const interval = setInterval(() => {
      // @ts-expect-error - google is loaded from script
      if (window.google?.accounts?.id && !buttonRendered) {
        initGoogleButton()
        clearInterval(interval)
      }
    }, 200)

    // Clean up after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (!buttonRendered) {
        setGoogleLoading(false)
      }
    }, 5000)

    return () => {
      clearTimeout(initTimeout)
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [user, buttonRendered, signInWithGoogle, scriptLoaded])

  // Reset button rendered state when user logs out
  useEffect(() => {
    if (!user) {
      setButtonRendered(false)
      setGoogleLoading(true)
    }
  }, [user])

  const handleGuestSignIn = () => {
    signInAsGuest()
    router.push(returnUrl)
  }

  const handleScriptLoad = () => {
    setScriptLoaded(true)
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
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

          {/* Google Sign In Container with fixed height to prevent layout shift */}
          <div className="w-full min-h-[44px] flex items-center justify-center relative">
            {/* Loading placeholder */}
            {googleLoading && !buttonRendered && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="outline"
                  className="w-full max-w-[300px] h-[44px] gap-3 cursor-wait"
                  disabled
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading Google Sign-In...</span>
                </Button>
              </div>
            )}
            {/* Google button container */}
            <div 
              ref={buttonContainerRef}
              id="google-signin-button" 
              className={`w-full flex justify-center transition-opacity duration-300 ${
                buttonRendered ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ minHeight: '44px' }}
            />
          </div>
          
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
