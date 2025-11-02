"use client"

export function SoulSyncLogo({ animated = false, className = "" }: { animated?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} ${animated ? "animate-pulse" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{`
          @keyframes breathe {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes flow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .soul-sync-circle {
            animation: ${animated ? "breathe 3s ease-in-out infinite" : "none"};
            transform-origin: 50% 50%;
          }
          .soul-sync-ring {
            animation: ${animated ? "flow 8s linear infinite" : "none"};
            transform-origin: 50% 50%;
          }
        `}</style>
        <linearGradient id="soulGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a5d4" />
          <stop offset="100%" stopColor="#a8d5ba" />
        </linearGradient>
      </defs>

      {/* Outer breathing ring */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="url(#soulGradient)"
        strokeWidth="1.5"
        opacity="0.3"
        className="soul-sync-ring"
      />

      {/* Middle circle */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="url(#soulGradient)"
        strokeWidth="2"
        opacity="0.5"
        className="soul-sync-circle"
      />

      {/* Inner circle - represents inner peace */}
      <circle cx="50" cy="50" r="28" fill="url(#soulGradient)" opacity="0.8" className="soul-sync-circle" />

      {/* Center dot - represents the soul/core */}
      <circle cx="50" cy="50" r="8" fill="white" opacity="0.9" />

      {/* Subtle wave pattern inside */}
      <path d="M 35 50 Q 40 45 45 50 T 55 50 T 65 50" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  )
}
