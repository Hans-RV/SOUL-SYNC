"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX, CloudRain, Waves, Trees, Music } from "lucide-react"

interface Sound {
  id: string
  name: string
  icon: React.ReactNode
  url: string
}

const SOUNDS: Sound[] = [
  {
    id: "rain",
    name: "Rain",
    icon: <CloudRain className="w-4 h-4" />,
    url: "https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3",
  },
  {
    id: "ocean",
    name: "Ocean",
    icon: <Waves className="w-4 h-4" />,
    url: "https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3",
  },
  {
    id: "forest",
    name: "Forest",
    icon: <Trees className="w-4 h-4" />,
    url: "https://assets.mixkit.co/active_storage/sfx/2394/2394-preview.mp3",
  },
  {
    id: "piano",
    name: "Piano",
    icon: <Music className="w-4 h-4" />,
    url: "https://assets.mixkit.co/active_storage/sfx/2395/2395-preview.mp3",
  },
]

export function BackgroundSounds() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSound, setActiveSound] = useState<string | null>(null)
  const [volume, setVolume] = useState([50])
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100
    }
  }, [volume, isMuted])

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume[0] / 100 : 0
    }
  }

  const handleSoundToggle = (sound: Sound) => {
    if (activeSound === sound.id) {
      // Stop current sound
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setActiveSound(null)
    } else {
      // Stop previous sound if any
      if (audioRef.current) {
        audioRef.current.pause()
      }

      // Play new sound
      const audio = new Audio(sound.url)
      audio.loop = true
      audio.volume = volume[0] / 100
      audio.play()
      audioRef.current = audio
      setActiveSound(sound.id)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <Card className="mb-2 p-4 w-64 border-primary/10 bg-card/95 backdrop-blur">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Calming Sounds</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMuteToggle}
                className="h-6 w-6 hover:bg-primary/10"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SOUNDS.map((sound) => (
                <Button
                  key={sound.id}
                  variant={activeSound === sound.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSoundToggle(sound)}
                  className={`gap-2 ${
                    activeSound === sound.id
                      ? "bg-primary text-primary-foreground"
                      : "border-primary/20 hover:bg-primary/10"
                  }`}
                >
                  {sound.icon}
                  <span className="text-xs">{sound.name}</span>
                </Button>
              ))}
            </div>

            {activeSound && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Volume</span>
                  <span>{volume[0]}%</span>
                </div>
                <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-full" />
              </div>
            )}
          </div>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`h-12 w-12 rounded-full shadow-lg ${
          activeSound ? "bg-primary hover:bg-primary/90" : "bg-card hover:bg-card/90"
        } border border-primary/20`}
      >
        {activeSound ? (
          <Volume2 className="h-5 w-5 text-primary-foreground" />
        ) : (
          <VolumeX className="h-5 w-5 text-primary" />
        )}
      </Button>
    </div>
  )
}
