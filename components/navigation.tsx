"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, Home, MessageCircle, BarChart3, Sparkles, Settings } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { SoulSyncLogo } from "@/components/soul-sync-logo"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/chat", label: "Chat", icon: MessageCircle },
    { href: "/mood-tracker", label: "Mood Tracker", icon: BarChart3 },
    { href: "/self-care", label: "Self-Care", icon: Sparkles },
  ]

  if (user) {
    navItems.push({ href: "/admin", label: "Admin", icon: Settings })
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8">
              <SoulSyncLogo animated className="text-primary" />
            </div>
            <span className="hidden sm:inline">SOUL SYNC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10 gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeSwitcher />
            {loading ? null : user ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/10 gap-2 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary/10 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border pt-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10 gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}

            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-foreground">Theme</span>
                <ThemeSwitcher />
              </div>
              {loading ? null : user ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-primary/20 text-primary hover:bg-primary/10 gap-2 bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <>
                  <Link href="/auth/login" className="block">
                    <Button variant="ghost" className="w-full text-foreground hover:text-primary hover:bg-primary/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
