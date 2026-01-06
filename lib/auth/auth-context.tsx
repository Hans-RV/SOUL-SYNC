"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

export type AuthUser = {
  id: string
  email: string | null
  name: string
  avatar?: string
  isGuest: boolean
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInAsGuest: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "soul-sync-auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const signInWithGoogle = useCallback(async () => {
    setLoading(true)
    try {
      // Using Google Identity Services for sign-in
      // @ts-expect-error - google is loaded from script
      const google = window.google

      if (!google) {
        throw new Error("Google Sign-In not loaded. Please refresh the page.")
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      
      if (!clientId || clientId === 'your-google-client-id-here') {
        throw new Error("Google Client ID not configured properly")
      }

      return new Promise<void>((resolve, reject) => {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => {
            try {
              // Decode JWT to get user info
              const payload = JSON.parse(atob(response.credential.split(".")[1]))
              const googleUser: AuthUser = {
                id: payload.sub,
                email: payload.email,
                name: payload.name || payload.email?.split("@")[0] || "User",
                avatar: payload.picture,
                isGuest: false,
              }
              setUser(googleUser)
              setLoading(false)
              resolve()
            } catch (error) {
              setLoading(false)
              reject(new Error("Failed to process Google Sign-In response"))
            }
          },
          use_fedcm_for_prompt: true,
        })

        // Render button instead of using One Tap prompt
        const buttonDiv = document.getElementById("google-signin-button")
        if (buttonDiv) {
          buttonDiv.innerHTML = '' // Clear existing content
          google.accounts.id.renderButton(buttonDiv, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "pill",
            width: buttonDiv.offsetWidth || 300,
          })
          setLoading(false)
          resolve()
        } else {
          setLoading(false)
          reject(new Error("Sign-in button container not found"))
        }
      })
    } catch (error) {
      setLoading(false)
      console.error("Google sign-in error:", error)
      throw error
    }
  }, [])

  const signInAsGuest = useCallback(() => {
    const guestUser: AuthUser = {
      id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: null,
      name: "Guest User",
      isGuest: true,
    }
    setUser(guestUser)
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    // Also sign out from Google if signed in
    try {
      // @ts-expect-error - google is loaded from script
      window.google?.accounts?.id?.disableAutoSelect()
    } catch {
      // Ignore errors
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
