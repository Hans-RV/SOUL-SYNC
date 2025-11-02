"use client"

export function SoulSyncLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <style>{`
                @keyframes breathe {
                  0%, 100% { opacity: 0.6; transform: scale(1); }
                  50% { opacity: 1; transform: scale(1.08); }
                }
                @keyframes flow {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                @keyframes pulse-glow {
                  0%, 100% { r: 8; opacity: 0.9; }
                  50% { r: 12; opacity: 0.4; }
                }
                .loader-circle {
                  animation: breathe 3s ease-in-out infinite;
                  transform-origin: 50% 50%;
                }
                .loader-ring {
                  animation: flow 8s linear infinite;
                  transform-origin: 50% 50%;
                }
                .loader-core {
                  animation: pulse-glow 2s ease-in-out infinite;
                }
              `}</style>
              <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4a5d4" />
                <stop offset="100%" stopColor="#a8d5ba" />
              </linearGradient>
            </defs>

            {/* Outer rotating ring */}
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="url(#loaderGradient)"
              strokeWidth="1.5"
              opacity="0.3"
              className="loader-ring"
            />

            {/* Middle breathing circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#loaderGradient)"
              strokeWidth="2"
              opacity="0.5"
              className="loader-circle"
            />

            {/* Inner circle */}
            <circle cx="50" cy="50" r="28" fill="url(#loaderGradient)" opacity="0.8" className="loader-circle" />

            {/* Pulsing core */}
            <circle cx="50" cy="50" r="8" fill="white" className="loader-core" />

            {/* Wave pattern */}
            <path
              d="M 35 50 Q 40 45 45 50 T 55 50 T 65 50"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>
        <p className="text-foreground/60 text-sm font-medium">Connecting to your wellness journey...</p>
      </div>
    </div>
  )
}
