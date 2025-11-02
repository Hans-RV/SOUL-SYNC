"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      console.log("[v0] Theme changed:", { theme, resolvedTheme })
    }
  }, [theme, resolvedTheme, mounted])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        const newTheme = isDark ? "light" : "dark"
        console.log("[v0] Switching theme to:", newTheme)
        setTheme(newTheme)
      }}
      className="w-9 h-9 hover:bg-primary/10 transition-colors"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-primary transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-primary transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
